import { Request, Response, NextFunction } from 'express';

import { HttpError } from '../../rest-api/httpError.model';
import { IUser, userModel } from '../../models/mongoose/user.model';
import { serverError } from '../error.controller';
import endpointConfig from '../../util/endpoint.config';
import { noAuthenticationMsg, invalidAuthenticationMethod, userNotEditorMsg, userNotAdminMsg, invalidAuthorizationMsg } from '../../util/messages.constants';
import { passphraseField, roleField } from '../../util/fields.constants';

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
                if (error.message !== invalidAuthenticationMethod) {
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
                next();
            }).catch((error: any) => serverError(next, error));
            break;
        // case 'jwt':
        //     break;
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
    return userModel.findOne(filter).then((user: IUser) => {
        if (!user) {
            throw new Error(invalidAuthenticationMethod);
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
    });
}

function adjustFilterToAuthMode(filter: { name?: string, role?: number; }) {
    const authMethod = endpointConfig.authMode();
    switch (authMethod) {
        case 'ntlm':
            break;
        case 'jwt':
            filter = Object.defineProperty(filter, passphraseField, '{$exists: true}');
            break;
        default:
            break;
    }
    return filter;
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
