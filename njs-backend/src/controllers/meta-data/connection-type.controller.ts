import { Request, Response, NextFunction } from 'express';

import { ConnectionType } from '../../models/meta-data/connection-type.model';
import { serverError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import { idField, nameField, reverseNameField } from '../../util/fields.constants';
import socket from '../socket.controller';
import { connectionTypeCtx, createAction, updateAction, deleteAction } from '../../util/socket.constants';
import {
    connectionTypeModelCanDelete,
    connectionTypeModelCreate,
    connectionTypeModelDelete,
    connectionTypeModelFindAll,
    connectionTypeModelFindSingle,
    connectionTypeModelUpdate,
} from '../../models/abstraction-layer/meta-data/connection-type.al';
import { modelGetAllowedDownwardConnectionTypesByItemType } from '../../models/abstraction-layer/meta-data/meta-data.al';

// Read
export const getConnectionTypes = (req: Request, res: Response, next: NextFunction) => {
    connectionTypeModelFindAll()
        .then((connectionTypes) => res.json(connectionTypes))
        .catch((error) => serverError(next, error));
}

export const getAllowedDownwardConnectionTypesByItemType = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[idField];
    modelGetAllowedDownwardConnectionTypesByItemType(id)
        .then((connectionTypes) => res.json(connectionTypes))
        .catch((error) => serverError(next, error));
}

export const getConnectionType = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[idField];
    connectionTypeModelFindSingle(id)
        .then((connectionType: ConnectionType) => {
            res.json(connectionType);
        })
        .catch((error) => serverError(next, error));
}

// Create
export const createConnectionType = (req: Request, res: Response, next: NextFunction) => {
    const name = req.body[nameField] as string;
    const reverseName = req.body[reverseNameField] as string;
    connectionTypeModelCreate(name, reverseName)
        .then(connectionType => {
            socket.emit(createAction, connectionTypeCtx, connectionType);
            res.status(201).json(connectionType);
        })
        .catch((error: any) => serverError(next, error));
}

// Update
export const updateConnectionType = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[idField];
    const name = req.body[nameField] as string;
    const reverseName = req.body[reverseNameField] as string;
    connectionTypeModelUpdate(id, name, reverseName)
        .then((connectionType) => {
            if (connectionType) {
                socket.emit(updateAction, connectionTypeCtx, connectionType);
                res.json(connectionType);
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
export const deleteConnectionType = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[idField];
    connectionTypeModelDelete(id)
        .then((connectionType) => {
            if (connectionType) {
                socket.emit(deleteAction, connectionTypeCtx, connectionType);
                res.json(connectionType);
            }
        })
        .catch((error: any) => serverError(next, error));
    }

export const canDeleteConnectionType = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[idField];
    connectionTypeModelCanDelete(id)
        .then(canDelete => res.json(canDelete))
        .catch((error: any) => serverError(next, error));
}
