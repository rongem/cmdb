import { Request, Response, NextFunction } from 'express';

import { handleValidationErrors } from '../../routes/validators';
import { UserInfo } from '../../models/item-data/user-info.model';
import userModel from '../../models/mongoose/user.model';
import { serverError, notFoundError } from '../error.controller';
import configurationItemModel from '../../models/mongoose/configuration-item.model';
import socket from '../socket.controller';

// Read
export function getCurrentUser(req: Request, res: Response, next: NextFunction) {
    return res.json(new UserInfo(req.authentication));
}

export function getAllUsers(req: Request, res: Response, next: NextFunction) {
    userModel.find().sort('name')
        .then(users => {
            return res.json(users.map(u => new UserInfo(u)));
        })
        .catch(error => serverError(next, error));
}

// search existing users inside the existing database that are not more than readers
export function searchUsersInDataBase(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    userModel.find({name: {$regex: req.params.text, $options: 'i'}, role: 0}).sort('name')
        .then(users => {
            return res.json(users.map(u => new UserInfo(u)));
        })
        .catch(error => serverError(next, error));
}

export function getRoleForUser(req: Request, res: Response, next: NextFunction) {
    return res.json((req.authentication ?? {role: 0}).role);
}

// Create
export function createUser(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    userModel.create({
        name: req.body.name,
        role: req.body.role,
        lastVisit: new Date(0),
    }).then(user => {
        const u = new UserInfo(user);
        socket.emit('user', 'create', u);
        return res.status(201).json(u);
    })
    .catch(error => serverError(next, error));
}

// Update
export function updateUser(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    userModel.findOne(req.body.name)
        .then(user => {
            if (!user) {
                throw notFoundError;
            }
            let changed = false;
            if (user.role != req.body.role) {
                user.role = req.body.role;
                changed = true;
            }
            if (!changed) {
                res.sendStatus(304);
                return;
            }
            return user.save();
        })
        .then(user => {
            if (user) {
                return res.json(new UserInfo(user));
            }
        })
        .catch(error => serverError(next, error));

}

// Delete
export function deleteUser(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    const name = req.params.domain ? req.params.domain + '\\' + req.params.name : req.params.name;
    let deleted = false;
    userModel.findOne({name})
        .then(async user => {
            if (!user) {
                throw notFoundError;
            }
            if (req.body.withResponsibilities === true) {
                configurationItemModel.updateMany(
                    {responsibleUsers: [user._id]},
                    {$pullAll: {responsibleUsers: user._id}}
                ).exec();
                deleted = true;
                return user.remove();
            } else {
                const docCount = await configurationItemModel.find({responsibleUsers: [user._id]}).estimatedDocumentCount();
                if (docCount > 0) {
                    user.role = 0;
                    return user.save();
                } else {
                    deleted = true;
                    return user.remove();
                }
            }
        })
        .then(user => {
            return res.json({user, deleted});
        })
        .catch(error => serverError(next, error));
}
