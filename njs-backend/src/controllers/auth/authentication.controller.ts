import { Request, Response, NextFunction, request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { HttpError } from '../../rest-api/httpError.model';
import { IUser, userModel } from '../../models/mongoose/user.model';
import { serverError } from '../error.controller';
import endpointConfig from '../../util/endpoint.config';
import {
    noAuthenticationMsg,
    invalidAuthentication,
    invalidAuthenticationMethod,
    userNotEditorMsg,
    userNotAdminMsg,
    invalidAuthorizationMsg,
    userCreationFailed
} from '../../util/messages.constants';
import { accountNameField, nameField, passphraseField, roleField } from '../../util/fields.constants';
import { adjustFilterToAuthMode, salt, userModelCreate } from '../auth/user-management.functions';
import { UserInfo } from '../../models/item-data/user-info.model';

export function getAuthentication(req: Request, res: Response, next: NextFunction) {
    const authMethod = endpointConfig.authMode();
    let name: string;
    switch (authMethod) {
        case 'ntlm':
            if (!req.ntlm) {
                throw new HttpError(401, noAuthenticationMsg);
            }
            const domain = !req.ntlm.DomainName || req.ntlm.DomainName === '.' ? req.ntlm.Workstation : req.ntlm.DomainName;
            name = domain + '\\' + req.ntlm.UserName;
            if (name === '\\') { name = endpointConfig.dev_substition_username(); }
            req.userName = name;
            getUser(name).catch(async (error: Error) => {
                if (error.message !== invalidAuthentication) {
                    throw error;
                }
                const noAdminsPresent = await checkNoAdminsPresent();
                const user2 = await userModel.create({
                    name,
                    role: 0,
                    lastVisit: new Date(),
                });
                if (user2.role !== 2 && noAdminsPresent) { // prevent lockout if there are no administrators at all
                    user2.role = 2;
                }
                req.authentication = user2;
                return user2;
            }).then((user) => {
                req.authentication = user;
                req.userName = user.name;
                next();
            }).catch((error: any) => serverError(next, error));
            break;
        case 'jwt':
            const authHeader = req.get('Authorization');
            if (!authHeader) {
                throw new HttpError(401, noAuthenticationMsg);
            }
            const encodedToken = authHeader.split(' ')[1];
            let token: any;
            try {
                token = jwt.verify(encodedToken, endpointConfig.jwt_server_key());
            } catch (error) {
                throw new HttpError(500, invalidAuthentication, error);
            }
            if (!token || !token.accountName) {
                throw new HttpError(401, invalidAuthentication);
            }
            getUser(token.accountName as string).then(user => {
                req.authentication = user;
                req.userName = user.name;
                next();
            }).catch((error: any) => serverError(next, error));
            break;
        default:
            throw new HttpError(401, invalidAuthenticationMethod);
    }
}

async function checkNoAdminsPresent() {
    const filter = { [roleField]: 2 };
    adjustFilterToAuthMode(filter);
    const adminCount = await userModel.find(filter).countDocuments();
    return adminCount === 0;
}

async function getUser(name: string): Promise<IUser> {
    const filter = { name };
    adjustFilterToAuthMode(filter);
    const noAdminsPresent = await checkNoAdminsPresent();
    const user: IUser = await userModel.findOne(filter);
    if (!user) {
        throw new HttpError(401, invalidAuthentication);
    }
    const updateQuery: {lastVisit: Date, role?: number} = {
        lastVisit: new Date()
    };
    if (user.role < 0 || user.role > 2) { // make sure role is valid
        user.role = 0;
        updateQuery.role = 0;
    }
    userModel.updateOne({_id: user._id}, updateQuery).exec(); // log last visit and eventually change role
    if (user.role !== 2 && noAdminsPresent) { // prevent lockout if there are no administrators at all
        user.role = 2;
    }
    return user;
}

// this function is for creating jwt tokens on the /login route only
export async function issueToken(req: Request, res: Response, next: NextFunction) {
    try {
        const name = (req.body[accountNameField] as string);
        const passphrase = req.body[passphraseField] as string;
        const noUsersPresent = (await userModel.find({[passphraseField]: {$exists: true}}).countDocuments()) === 0;
        let result = false;
        let user: UserInfo;
        try {
            const u = await getUser(name);
            user = new UserInfo(u);
            result = await bcrypt.compare(passphrase, u.passphrase!);
        } catch (error) {
            if (noUsersPresent) { // create first login as administrator, if no user exists
                const encryptedPassphrase = await bcrypt.hash(passphrase, salt);
                user = await userModelCreate(name, 2, encryptedPassphrase);
                if (!user) {
                    throw new Error(userCreationFailed);
                }
                result = true;
            }
        }
        if (!result) {
            throw new HttpError(401, invalidAuthentication);
        }
        const payload = {...user!};
        const token = jwt.sign(payload, endpointConfig.jwt_server_key(), { expiresIn: '1h' });
        res.json({ token, username: name });
    } catch (error) {
        serverError(next, error);
    }
}

export function isEditor(req: Request, res: Response, next: NextFunction) {
    if (!req.authentication) {
        throw new HttpError(403, invalidAuthorizationMsg);
    }
    if (req.authentication.role < 1) {
        next(new HttpError(403, userNotEditorMsg));
    } else {
        next();
    }
}

export function isAdministrator(req: Request, res: Response, next: NextFunction) {
    if (!req.authentication) {
        throw new HttpError(403, invalidAuthorizationMsg);
    }
    if (req.authentication.role !== 2) {
        next(new HttpError(403, userNotAdminMsg));
    } else {
        next();
    }
}
