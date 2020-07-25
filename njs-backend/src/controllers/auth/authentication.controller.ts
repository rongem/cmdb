import { Request, Response, NextFunction } from 'express';

import { HttpError } from '../../rest-api/httpError.model';
import userModel from '../../models/mongoose/user.model';
import { serverError } from '../error.controller';
import endpointConfig from '../../util/endpoint.config';

export function getAuthentication(req: Request, res: Response, next: NextFunction) {
    const authMethod = 'ntlm';
    let name: string;
    switch (authMethod) {
        case 'ntlm':
            if (!req.ntlm) {
                throw new HttpError(401, 'No authentication.');
            }
            const domain = !req.ntlm.DomainName || req.ntlm.DomainName === '.' ? req.ntlm.Workstation : req.ntlm.DomainName;
            name = domain + '\\' + req.ntlm.UserName;
            if (name === '\\') { name = endpointConfig.dev_substition_username(); }
            break;
        default:
            throw new HttpError(401, 'No valid authentication method configured.');
            break;
    }
    userModel.findOne({name})
        .then(user => {
            if (user) {
                req.authentication = user;
            }
            next();
        })
        .catch(error => serverError(next, error));
}

export function isEditor (req: Request, res: Response, next: NextFunction) {
    if (!req.authentication) {
        throw new HttpError(403, 'User is not in editor role');
    }
    next();
}

export function isAdministrator (req: Request, res: Response, next: NextFunction) {
    if (!req.authentication) {
        throw new HttpError(403, 'User is not allowed to edit or manage.');
    }
    if (req.authentication.isAdmin !== true) { // check if there are any administrators to prevent lockout
        userModel.find({isAdmin: true}).count()
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