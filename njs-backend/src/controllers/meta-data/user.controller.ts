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
import { userCreationFailed } from '../../util/messages.constants';

const salt = 15; // lower this value for faster authentication, or raise it for more security. You should not go lower than 12.

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
    userModel.find({ name: { $regex: req.params[textField], $options: 'i' }, role: 0 }).sort(nameField)
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
    if (passphrase) {
        return bcrypt.hash(passphrase, salt).then(password => userModelCreate(name, role, password));
    } else {
        return userModelCreate(name, role);
    }
}

async function userModelCreate(name: string, role: number, passphrase?: string) {
    const user = await userModel.create({ name, role, passphrase, lastVisit: new Date(0) });
    if (!user) {
        throw new Error(userCreationFailed);
    }
    return new UserInfo(user);
}

// Update
export function updateUser(req: Request, res: Response, next: NextFunction) {
    userModel.findOne({ name: req.body[accountNameField] })
        .then((user: IUser) => {
            if (!user) {
                throw notFoundError;
            }
            let changed = false;
            if (user.role !== req.body[roleField]) {
                user.role = req.body[roleField];
                changed = true;
            }
            if (!changed) {
                res.sendStatus(304);
                return;
            }
            return user.save();
        })
        .then((user: IUser) => {
            if (user) {
                const u = new UserInfo(user);
                socket.emit(userCat, updateCtx, u);
                return res.json(u);
            }
        })
        .catch((error: any) => serverError(next, error));

}

// Delete
export function deleteUser(req: Request, res: Response, next: NextFunction) {
    const name = req.params[domainField] ? req.params[domainField] + '\\' + req.params[nameField] : req.params[nameField];
    let deleted = false;
    userModel.findOne({ name })
        .then(async (user: IUser) => {
            if (!user) {
                throw notFoundError;
            }
            if (+req.params[withResponsibilitiesField] > 0) {
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
