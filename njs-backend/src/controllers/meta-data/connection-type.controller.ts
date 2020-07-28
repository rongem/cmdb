import { Request, Response, NextFunction } from 'express';

import connectionRuleModel from '../../models/mongoose/connection-rule.model';
import connectionTypeModel from '../../models/mongoose/connection-type.model';
import { ConnectionType } from '../../models/meta-data/connection-type.model';
import { handleValidationErrors } from '../../routes/validators';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';

// Read
export function getConnectionTypes(req: Request, res: Response, next: NextFunction) {
    connectionTypeModel.find().sort('name')
        .then(cts => res.json(cts.map(ct => new ConnectionType(ct))))
        .catch(error => serverError(next, error));
}

export function getAllowedDownwardConnectionTypesByItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
}

export function getConnectionType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionTypeModel.findById(req.params.id)
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
        handleValidationErrors(req);
        connectionTypeModel.create({
            name: req.body.name,
            reverseName: req.body.reverseName,
        }).then(connectionType => {
            const ct = new ConnectionType(connectionType);
            socket.emit('connection-types', 'create', ct);
            res.status(201).json(ct);
        }).catch(error => serverError(next, error));
}

// Update
export function updateConnectionType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionTypeModel.findById(req.params.id)
        .then(connectionType => {
            if (!connectionType) {
                throw notFoundError;
            }
            let changed = false;
            if (connectionType.name !== req.body.name) {
                connectionType.name = req.body.name;
                changed = true;
            }
            if (connectionType.reverseName !== req.body.reverseName) {
                connectionType.reverseName = req.body.reverseName;
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
                socket.emit('connection-types', 'update', ct);
                return res.json(ct);
            }
        })
        .catch(error => serverError(next, error));
}

// Delete
export function deleteConnectionType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionTypeModel.findById(req.params.id)
        .then(async connectionType => {
            if (!connectionType) {
                throw notFoundError;
            }
            const value = await connectionRuleModel.find({ connectionType: req.params.id }).estimatedDocumentCount();
            if (value > 0) {
                next(new HttpError(409, 'Connection rule is still used by connections.'));
                return;
            }
            return connectionType.remove();
        })
        .then(connectionType => {
            if (connectionType) {
                const ct = new ConnectionType(connectionType);
                socket.emit('connection-types', 'delete', ct);
                return res.json(ct);
            }
        })
        .catch(error => serverError(next, error));
    }
    
    export function canDeleteConnectionType(req: Request, res: Response, next: NextFunction) {
        handleValidationErrors(req);
        connectionRuleModel.find({connectionType: req.params.id}).estimatedDocumentCount()
        .then(value => res.json(value === 0))
        .catch(error => serverError(next, error));
}
