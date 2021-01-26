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
} from './connection-type.al';
import { modelGetAllowedDownwardConnectionTypesByItemType } from './meta-data.al';

// Read
export function getConnectionTypes(req: Request, res: Response, next: NextFunction) {
    connectionTypeModelFindAll()
        .then((connectionTypes) => res.json(connectionTypes))
        .catch((error) => serverError(next, error));
}

export function getAllowedDownwardConnectionTypesByItemType(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField];
    modelGetAllowedDownwardConnectionTypesByItemType(id)
        .then((connectionTypes) => res.json(connectionTypes))
        .catch((error) => serverError(next, error));
}

export function getConnectionType(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField];
    connectionTypeModelFindSingle(id)
        .then((connectionType: ConnectionType) => {
            res.json(connectionType);
        })
        .catch((error) => serverError(next, error));
}

// Create
export function createConnectionType(req: Request, res: Response, next: NextFunction) {
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
export function updateConnectionType(req: Request, res: Response, next: NextFunction) {
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
export function deleteConnectionType(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField];
    connectionTypeModelDelete(id)
        .then((connectionType) => {
            if (connectionType) {
                socket.emit(deleteAction, connectionTypeCtx, connectionType);
                return res.json(connectionType);
            }
        })
        .catch((error: any) => serverError(next, error));
    }

export function canDeleteConnectionType(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField];
    connectionTypeModelCanDelete(id)
        .then(canDelete => res.json(canDelete))
        .catch((error: any) => serverError(next, error));
}
