import { Request, Response, NextFunction } from 'express';

import { UserInfo } from '../../models/item-data/user-info.model';
import { IUser, userModel } from '../../models/mongoose/user.model';
import { serverError, notFoundError } from '../error.controller';
import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import socket from '../socket.controller';
import { textField, nameField, roleField, domainField, withResponsibilitiesField, accountNameField } from '../../util/fields.constants';
import { userCat, createCtx, updateCtx, deleteCtx } from '../../util/socket.constants';

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
    userModel.find({name: {$regex: req.params[textField], $options: 'i'}, role: 0}).sort(nameField)
        .then((users: IUser[]) => {
            return res.json(users.map(u => new UserInfo(u)));
        })
        .catch((error: any) => serverError(next, error));
}

export function getRoleForUser(req: Request, res: Response, next: NextFunction) {
    return res.json((req.authentication ?? {role: 0}).role);
}

// Create
export function createUser(req: Request, res: Response, next: NextFunction) {
    userModel.create({
        name: req.body[accountNameField],
        role: req.body[roleField],
        lastVisit: new Date(0),
    }).then(user => {
        const u = new UserInfo(user);
        socket.emit(userCat, createCtx, u);
        return res.status(201).json(u);
    })
    .catch((error: any) => serverError(next, error));
}

// Update
export function updateUser(req: Request, res: Response, next: NextFunction) {
    userModel.findOne({name: req.body[accountNameField]})
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
    userModel.findOne({name})
        .then(async (user: IUser) => {
            if (!user) {
                throw notFoundError;
            }
            if (Number.parseInt(req.params[withResponsibilitiesField]) > 0) {
                configurationItemModel.updateMany(
                    {responsibleUsers: [user._id]},
                    {$pullAll: {responsibleUsers: user._id}}
                ).exec();
                deleted = true;
                return user.remove();
            } else {
                const docCount = await configurationItemModel.find({responsibleUsers: [user._id]}).countDocuments();
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
            return res.json({user, deleted});
        })
        .catch((error: any) => serverError(next, error));
}
