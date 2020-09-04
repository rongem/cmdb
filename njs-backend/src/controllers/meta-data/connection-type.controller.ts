import { Request, Response, NextFunction } from 'express';

import { connectionRuleModel } from '../../models/mongoose/connection-rule.model';
import { connectionTypeModel } from '../../models/mongoose/connection-type.model';
import { ConnectionType } from '../../models/meta-data/connection-type.model';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';
import { idField, nameField, reverseNameField } from '../../util/fields.constants';
import { disallowedDeletionOfConnectionTypeMsg } from '../../util/messages.constants';
import { connectionTypeCat, createCtx, updateCtx, deleteCtx } from '../../util/socket.constants';

// Read
export function getConnectionTypes(req: Request, res: Response, next: NextFunction) {
    connectionTypeModel.find().sort(nameField)
        .then(cts => res.json(cts.map(ct => new ConnectionType(ct))))
        .catch(error => serverError(next, error));
}

export function getAllowedDownwardConnectionTypesByItemType(req: Request, res: Response, next: NextFunction) {
    // tbd
}

export function getConnectionType(req: Request, res: Response, next: NextFunction) {
    connectionTypeModel.findById(req.params[idField])
        .then(connectionType => {
            if (!connectionType) {
                throw notFoundError;
            }
            res.json(new ConnectionType(connectionType));
        })
        .catch(error => serverError(next, error));
    }
    // Create
export function createConnectionType(req: Request, res: Response, next: NextFunction) {
        connectionTypeModel.create({
            name: req.body[nameField],
            reverseName: req.body[reverseNameField],
        }).then(connectionType => {
            const ct = new ConnectionType(connectionType);
            socket.emit(connectionTypeCat, createCtx, ct);
            res.status(201).json(ct);
        }).catch(error => serverError(next, error));
}

// Update
export function updateConnectionType(req: Request, res: Response, next: NextFunction) {
    connectionTypeModel.findById(req.params[idField])
        .then(connectionType => {
            if (!connectionType) {
                throw notFoundError;
            }
            let changed = false;
            if (connectionType.name !== req.body[nameField]) {
                connectionType.name = req.body[nameField];
                changed = true;
            }
            if (connectionType.reverseName !== req.body[reverseNameField]) {
                connectionType.reverseName = req.body[reverseNameField];
                changed = true;
            }
            if (!changed) {
                res.sendStatus(304);
                return;
            }
            return connectionType.save();
        })
        .then(connectionType => {
            if (connectionType) {
                const ct = new ConnectionType(connectionType);
                socket.emit(connectionTypeCat, updateCtx, ct);
                return res.json(ct);
            }
        })
        .catch(error => serverError(next, error));
}

// Delete
export function deleteConnectionType(req: Request, res: Response, next: NextFunction) {
    connectionTypeModel.findById(req.params[idField])
        .then(async connectionType => {
            if (!connectionType) {
                throw notFoundError;
            }
            const value = await connectionRuleModel.find({ connectionType: req.params[idField] }).countDocuments();
            if (value > 0) {
                next(new HttpError(409, disallowedDeletionOfConnectionTypeMsg));
                return;
            }
            return connectionType.remove();
        })
        .then(connectionType => {
            if (connectionType) {
                const ct = new ConnectionType(connectionType);
                socket.emit(connectionTypeCat, deleteCtx, ct);
                return res.json(ct);
            }
        })
        .catch(error => serverError(next, error));
    }

export function canDeleteConnectionType(req: Request, res: Response, next: NextFunction) {
    connectionRuleModel.find({connectionType: req.params[idField]}).countDocuments()
        .then(value => res.json(value === 0))
        .catch(error => serverError(next, error));
}
