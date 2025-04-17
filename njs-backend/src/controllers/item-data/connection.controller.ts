import { Request, Response, NextFunction } from 'express';
import {
    connectionTypeField,
    pageField,
    upperItemField,
    idField,
    lowerItemField,
    upperItemIdField,
    lowerItemIdField,
    ruleIdField,
    descriptionField,
} from '../../util/fields.constants';
import { Connection } from '../../models/item-data/connection.model';
import { serverError, notFoundError } from '../error.controller';
import socket from '../socket.controller';
import { connectionCtx, createAction, updateAction, deleteAction } from '../../util/socket.constants';
import { HttpError } from '../../rest-api/httpError.model';
import {
    connectionsCount,
    connectionModelCreate,
    connectionModelDelete,
    connectionModelFind,
    connectionModelFindAll,
    connectionModelFindSingle,
    connectionModelUpdate
} from '../../models/abstraction-layer/item-data/connection.al';
import { Types } from 'mongoose';

// Read
export const getConnections = async (req: Request, res: Response, next: NextFunction) => {
    const max = 1000;
    const totalConnections = await connectionsCount();
    const page = +(req.query[pageField] ?? req.params[pageField] ?? (req.body ? req.body[pageField] : 1) ?? 1);
    connectionModelFindAll(page, max)
      .then((connections: Connection[]) =>
        res.json({
          connections,
          totalConnections,
        })
      )
      .catch((error: any) => serverError(next, error));
}

export const getConnectionsForUpperItem = (req: Request, res: Response, next: NextFunction) => {
    connectionModelFind({upperItem: req.params[idField]})
        .then((connections: Connection[]) => res.json(connections))
        .catch((error: any) => serverError(next, error));
}

export const getConnectionsForLowerItem = (req: Request, res: Response, next: NextFunction) => {
    connectionModelFind({lowerItem: req.params[idField]})
        .then(connections => res.json(connections))
        .catch((error: any) => serverError(next, error));
}

export const getConnectionsForItem = (req: Request, res: Response, next: NextFunction) => {
    connectionModelFind({$or: [{lowerItem: new Types.ObjectId(req.params[idField])}, {upperItem: new Types.ObjectId(req.params[idField])}]})
        .then(connections => res.json(connections))
        .catch((error: any) => serverError(next, error));
}

export const getConnection = (req: Request, res: Response, next: NextFunction) => {
    connectionModelFindSingle(req.params[idField])
        .then((connection: Connection) => res.json(connection))
        .catch((error: any) => serverError(next, error));
}

export const getConnectionByContent = (req: Request, res: Response, next: NextFunction) => {
    connectionModelFind({lowerItem: req.params[lowerItemField], upperItem: req.params[upperItemField]})
        .then((connections) => {
            const connection = connections.find(c => c.typeId === req.params[connectionTypeField]);
            if (!connection) {
                throw notFoundError;
            }
            res.json(connection);
        })
        .catch((error: any) => serverError(next, error));
}

// Create
export const createConnection = (req: Request, res: Response, next: NextFunction) => {
    const connectionRule = req.body[ruleIdField] as string;
    const upperItem = req.body[upperItemIdField] as string;
    const lowerItem = req.body[lowerItemIdField] as string;
    const description = req.body[descriptionField] as string;
    connectionModelCreate(req.connectionRule, connectionRule, upperItem, lowerItem, description, req.authentication)
        .then(connection => {
            if (connection) {
                socket.emit(createAction, connectionCtx, connection);
                res.status(201).json(connection);
            }
        })
       .catch((error: any) => serverError(next, error));
}

// Update
export const updateConnection = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[idField];
    const description = req.body[descriptionField] as string;
    connectionModelUpdate(id, description, req.authentication)
        .then((connection) => {
            if (connection) {
                socket.emit(updateAction, connectionCtx, connection);
                res.json(connection);
            }
        })
        .catch((error: HttpError) => {
            if (error.httpStatusCode === 304)
            {
                res.sendStatus(304);
                return;
            }
            serverError(next, error);
        });
}

// Delete
export const deleteConnection = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[idField];
    connectionModelDelete(id, req.authentication)
        .then((connection: Connection) => {
            if (connection) {
                socket.emit(deleteAction, connectionCtx, connection);
                res.json(connection);
            }
        })
        .catch((error: any) => serverError(next, error));
}
