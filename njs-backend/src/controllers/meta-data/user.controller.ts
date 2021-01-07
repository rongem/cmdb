import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

import { UserInfo } from '../../models/item-data/user-info.model';
import { IUser, userModel } from '../../models/mongoose/user.model';
import { serverError, notFoundError } from '../error.controller';
import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import socket from '../socket.controller';
import {
    textField,
    nameField,
    roleField,
    domainField,
    withResponsibilitiesField,
    accountNameField,
    passphraseField
} from '../../util/fields.constants';
import { userCat, createCtx, updateCtx, deleteCtx } from '../../util/socket.constants';
import { invalidRoleMsg, nothingChanged } from '../../util/messages.constants';
import { adjustFilterToAuthMode, salt, userModelCreate } from '../auth/user-management.functions';
import endpointConfig from '../../util/endpoint.config';
import { HttpError } from '../../rest-api/httpError.model';

// Read
export function getCurrentUser(req: Request, res: Response, next: NextFunction) {
    return res.json(new UserInfo(req.authentication));
}

export function getAllUsers(req: Request, res: Response, next: NextFunction) {
    userModel.find().sort(nameField)
        .then((users: IUser[]) => {
            return res.json(users.map(u => new UserInfo(u)));
        })
        .catch((error: any) => serverError(next, error));
}

// search existing users inside the existing database that are not more than readers
export function searchUsersInDataBase(req: Request, res: Response, next: NextFunction) {
    const filter = { name: { $regex: req.params[textField], $options: 'i' }, role: 0 };
    adjustFilterToAuthMode(filter);
    userModel.find(filter).sort(nameField)
        .then((users: IUser[]) => {
            return res.json(users.map(u => new UserInfo(u)));
        })
        .catch((error: any) => serverError(next, error));
}

export function getRoleForUser(req: Request, res: Response, next: NextFunction) {
    return res.json((req.authentication ?? { role: 0 }).role);
}

// Create
export function createUser(req: Request, res: Response, next: NextFunction) {
    const name = req.body[accountNameField] as string;
    const role = +req.body[roleField];
    const passphrase = req.body[passphraseField] as string;
    createUserHandler(name, role, passphrase).then(user => {
        socket.emit(userCat, createCtx, user);
        return res.status(201).json(user);
    })
        .catch((error: any) => serverError(next, error));
}

function createUserHandler(name: string, role: number, passphrase: string | undefined) {
    if (role < 0 || role > 2) {
        throw new HttpError(422, invalidRoleMsg);
    }
    if (passphrase) {
        name = name;
        return bcrypt.hash(passphrase, salt).then(password => userModelCreate(name, role, password));
    } else {
        return userModelCreate(name, role);
    }
}

// Update
export function updateUser(req: Request, res: Response, next: NextFunction) {
    const name = req.body[accountNameField];
    const role = +req.body[roleField];
    const passphrase = endpointConfig.authMode() === 'jwt' ? req.body[passphraseField] : undefined;
    updateUserHandler(name, role, passphrase).then((user: UserInfo) => {
        if (user) {
            socket.emit(userCat, updateCtx, user);
            return res.json(user);
        }
    }).catch((error: any) => {
        if (error.httpStatusCode === 304) {
            res.sendStatus(304);
        } else {
            serverError(next, error);
        }
    });
}

export function updateUserPassword(req: Request, res: Response, next: NextFunction) {
    const name = req.userName;
    const role = req.authentication.role;
    const passphrase = req.body[passphraseField];
    updateUserHandler(name, role, passphrase).catch((error: HttpError) => {
        if (error.httpStatusCode === 304) {
            res.sendStatus(304);
            return undefined;
        }
        throw error;
    }).then((user: IUser | undefined) => {
        if (user) {
            socket.emit(userCat, updateCtx, user);
            return res.json(user);
        }
    }).catch((error: any) => serverError(next, error));
}

function updateUserHandler(name: string, role: number, passphrase: string | undefined) {
    if (role < 0 || role > 2) {
        throw new HttpError(422, invalidRoleMsg);
    }
    return userModelUpdate(name, role, passphrase);
}

function userModelUpdate(name: string, role: number, passphrase?: string) {
    const filter = { name };
    adjustFilterToAuthMode(filter);
    return userModel.findOne(filter)
        .then(async (user: IUser) => {
            if (!user) {
                throw notFoundError;
            }
            let changed = false;
            if (user.role !== role) {
                user.role = role;
                changed = true;
            }
            if (passphrase) {
                const isEqual = await bcrypt.compare(passphrase, user.passphrase!);
                if (!isEqual) {
                    user.passphrase = await bcrypt.hash(passphrase, salt);
                    changed = true;
                }
            }
            if (!changed) {
                throw new HttpError(304, nothingChanged);
            }
            user = await user.save();
            return new UserInfo(user);
        });
}

// Delete
export function deleteUser(req: Request, res: Response, next: NextFunction) {
    const name = req.params[domainField] ? req.params[domainField] + '\\' + req.params[accountNameField] : req.params[accountNameField];
    const withResponsibilities = +req.params[withResponsibilitiesField] > 0;
    const filter = { name };
    adjustFilterToAuthMode(filter);
    let deleted = false;
    userModel.findOne(filter)
        .then(async (user: IUser) => {
            if (!user) {
                throw notFoundError;
            }
            if (withResponsibilities) {
                configurationItemModel.updateMany(
                    { responsibleUsers: [user._id] },
                    { $pullAll: { responsibleUsers: user._id } }
                ).exec();
                deleted = true;
                return user.remove();
            } else {
                const docCount = await configurationItemModel.find({ responsibleUsers: [user._id] }).countDocuments();
                if (docCount > 0) {
                    user.role = 0;
                    return user.save();
                } else {
                    deleted = true;
                    return user.remove();
                }
            }
        })
        .then((user: IUser) => {
            const u = new UserInfo(user);
            socket.emit(userCat, deleted ? deleteCtx : updateCtx, u);
            return res.json({ user, deleted });
        })
        .catch((error: any) => serverError(next, error));
}
