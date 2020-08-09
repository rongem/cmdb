import { Request, Response, NextFunction } from 'express';

import { HttpError } from '../../rest-api/httpError.model';
import userModel from '../../models/mongoose/user.model';
import { serverError } from '../error.controller';
import endpointConfig from '../../util/endpoint.config';

export function getAuthentication(req: Request, res: Response, next: NextFunction) {
    const authMethod = endpointConfig.authMode();
    let name: string;
    switch (authMethod) {
        case 'ntlm':
            if (!req.ntlm) {
                throw new HttpError(401, 'No authentication.');
            }
            const domain = !req.ntlm.DomainName || req.ntlm.DomainName === '.' ? req.ntlm.Workstation : req.ntlm.DomainName;
            name = domain + '\\' + req.ntlm.UserName;
            if (name === '\\') { name = endpointConfig.dev_substition_username(); }
            req.userName = name;
            break;
        default:
            throw new HttpError(401, 'No valid authentication method configured.');
            break;
    }
    userModel.findOne({name})
        .then(async user => {
            if (user) {
                const updateQuery: {lastVisit: Date, role?: number} = {
                    lastVisit: new Date()
                }
                if (user.role < 0 || user.role > 2) { // make sure role is valid
                    user.role = 0;
                    updateQuery.role = 0;
                }
                req.authentication = user;
                userModel.updateOne({_id: user._id}, updateQuery).exec(); // log last visit and eventually change role
            } else {
                const user2 = await userModel.create({
                    name: name,
                    role: 0,
                    lastVisit: new Date(),
                });
                req.authentication = user2;
            }
            next();
        })
        .catch(error => serverError(next, error));
}

export function isEditor (req: Request, res: Response, next: NextFunction) {
    if (!req.authentication || req.authentication.role < 1) {
        throw new HttpError(403, 'User is not in editor role');
    }
    next();
}

export function isAdministrator (req: Request, res: Response, next: NextFunction) {
    if (!req.authentication) {
        throw new HttpError(403, 'User is not allowed to edit or manage.');
    }
    if (req.authentication.role !== 2) { // check if there are any administrators to prevent lockout
        userModel.find({role: 2}).count()
            .then(value => {
                if (value > 0)
                {
                    next(new HttpError(403, 'User is not in admin role'));
                } else {
                    next();
                }
            })
            .catch(error => serverError(next, error))
    } else {
        next();
    }
}