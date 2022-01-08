import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { HttpError } from '../../rest-api/httpError.model';
import { serverError } from '../error.controller';
import endpointConfig from '../../util/endpoint.config';
import {
    noAuthenticationMsg,
    invalidAuthentication,
    invalidAuthenticationMethod,
    userNotEditorMsg,
    userNotAdminMsg,
    invalidAuthorizationMsg,
    userCreationFailedMsg,
    invalidAuthenticationToken
} from '../../util/messages.constants';
import { accountNameField, passphraseField } from '../../util/fields.constants';
import {
    salt,
    userModelCheckCredentials,
    userModelCreate,
    userModelFindAndCount,
    userModelFindByName,
    userModelLogLastVisit
} from '../../models/abstraction-layer/meta-data/user.al';
import { UserAccount } from '../../models/item-data/user-account.model';

export const getAuthentication = (req: Request, res: Response, next: NextFunction) => {
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
                const user2 = await userModelCreate(name, 0);
                if (user2.role !== 2 && noAdminsPresent) { // prevent lockout if there are no administrators at all
                    user2.role = 2;
                }
                req.authentication = user2;
                return user2;
            }).then((user) => {
                req.authentication = user;
                req.userName = user.accountName;
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
                throw new HttpError(401, invalidAuthenticationToken, error);
            }
            if (!token || !token.accountName) {
                console.log(token, token?.accountName);
                throw new HttpError(401, invalidAuthentication);
            }
            getUser(token.accountName as string).then(user => {
                req.authentication = user;
                req.userName = user.accountName;
                next();
            }).catch((error: any) => serverError(next, error));
            break;
        default:
            throw new HttpError(401, invalidAuthenticationMethod);
    }
}

async function checkNoAdminsPresent() {
    const adminCount = await userModelFindAndCount({ role: 2 });
    return adminCount === 0;
}

async function getUser(name: string) {
    const noAdminsPresent = await checkNoAdminsPresent();
    const user = await userModelFindByName(name);
    if (!user) {
        throw new HttpError(401, invalidAuthentication);
    }
    const invalidRole = user.role < 0 || user.role > 2;
    if (invalidRole) { // make sure role is valid
        user.role = 0;
    }
    userModelLogLastVisit(name, invalidRole);
    if (user.role !== 2 && noAdminsPresent) { // prevent lockout if there are no administrators at all
        user.role = 2;
    }
    return user;
}

// this function is for creating jwt tokens on the /login route only
export const issueToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const name = (req.body[accountNameField] as string);
        const passphrase = req.body[passphraseField] as string;
        const noUsersPresent = (await userModelFindAndCount({passphrase: {$exists: true}})) === 0;
        let result = false;
        let user: UserAccount;
        try {
            const res = await userModelCheckCredentials(name, passphrase);
            result = res.result;
            user = res.user;
        } catch (error) {
            if (noUsersPresent) { // create first login as administrator, if no user exists
                const encryptedPassphrase = bcrypt.hashSync(passphrase, salt);
                user = await userModelCreate(name, 2, encryptedPassphrase);
                if (!user) {
                    throw new Error(userCreationFailedMsg);
                }
                result = true;
            }
        }
        if (!result) {
            throw new HttpError(401, invalidAuthentication);
        }
        const payload = {...user!};
        const token = jwt.sign(payload, endpointConfig.jwt_server_key(), { expiresIn: '8h' });
        res.json({ token, username: name });
    } catch (error) {
        serverError(next, error);
    }
}

export const isEditor = (req: Request, res: Response, next: NextFunction) => {
    if (!req.authentication) {
        throw new HttpError(403, invalidAuthorizationMsg);
    }
    if (req.authentication.role < 1) {
        next(new HttpError(403, userNotEditorMsg));
    } else {
        next();
    }
}

export const isAdministrator = (req: Request, res: Response, next: NextFunction) => {
    if (!req.authentication) {
        throw new HttpError(403, invalidAuthorizationMsg);
    }
    if (req.authentication.role !== 2) {
        next(new HttpError(403, userNotAdminMsg));
    } else {
        next();
    }
}
