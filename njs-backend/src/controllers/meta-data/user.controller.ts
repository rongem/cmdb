import { Request, Response, NextFunction } from 'express';

import { UserAccount } from '../../models/item-data/user-account.model';
import { serverError } from '../error.controller';
import {
    textField,
    roleField,
    domainField,
    withResponsibilitiesField,
    accountNameField,
    passphraseField
} from '../../util/fields.constants';
import endpointConfig from '../../util/endpoint.config';
import { HttpError } from '../../rest-api/httpError.model';
import { userCtx, createAction, updateAction, deleteAction } from '../../util/socket.constants';
import socket from '../socket.controller';
import {
    createUserHandler,
    userModelDelete,
    userModelFind,
    userModelFindAll,
    userModelUpdate,
} from '../../models/abstraction-layer/meta-data/user.al';

// Read
export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
    res.json(req.authentication);
}

export const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    userModelFindAll()
        .then((users) => res.json(users))
        .catch((error: any) => serverError(next, error));
}

// search existing users inside the existing database that are not more than readers
export const searchUsersInDataBase = (req: Request, res: Response, next: NextFunction) => {
    const filter = { name: { $regex: req.params[textField], $options: 'i' }, role: 0 };
    userModelFind(filter)
        .then((users) => res.json(users))
        .catch((error: any) => serverError(next, error));
}

export const getRoleForUser = (req: Request, res: Response, next: NextFunction) => {
    res.json((req.authentication ?? { role: 0 }).role);
}

// Create
export const createUser = (req: Request, res: Response, next: NextFunction) => {
    const name = req.body[accountNameField] as string;
    const role = +req.body[roleField];
    const passphrase = req.body[passphraseField] as string;
    createUserHandler(name, role, passphrase).then(user => {
        socket.emit(createAction, userCtx, user);
        res.status(201).json(user);
    })
        .catch((error: any) => serverError(next, error));
}

// Update
export const updateUser = (req: Request, res: Response, next: NextFunction) => {
    const name = req.body[accountNameField];
    const role = +req.body[roleField];
    const passphrase = endpointConfig.authMode() === 'jwt' ? req.body[passphraseField] : undefined;
    userModelUpdate(name, role, passphrase).then((user: UserAccount) => {
        if (user) {
            socket.emit(updateAction, userCtx, user);
            res.json(user);
        }
    }).catch((error: HttpError) => {
        if (error.httpStatusCode === 304) {
            res.sendStatus(304);
        } else {
            serverError(next, error);
        }
    });
}

export const updateUserPassword = (req: Request, res: Response, next: NextFunction) => {
    const name = req.userName;
    const role = req.authentication.role;
    const passphrase = req.body[passphraseField];
    userModelUpdate(name, role, passphrase)
        .then((user: UserAccount) => {
            if (user) {
                socket.emit(updateAction, userCtx, user);
                res.json(user);
            }
        })
        .catch((error: HttpError) => {
            if (error.httpStatusCode === 304) {
                res.sendStatus(304);
                return;
            }
            serverError(next, error);
        });
}

// Delete
export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    const name = req.params[domainField] as string ? req.params[domainField] as string + '\\' + req.params[accountNameField] as string : req.params[accountNameField] as string;
    const withResponsibilities = +req.params[withResponsibilitiesField] > 0;
    userModelDelete(name, withResponsibilities)
        .then((result) => {
            socket.emit(result.deleted ? deleteAction : updateAction, userCtx, result.user);
            res.json(result);
        })
        .catch((error: any) => serverError(next, error));
}
