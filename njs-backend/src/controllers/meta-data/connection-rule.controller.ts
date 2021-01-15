import { Request, Response, NextFunction } from 'express';

import { serverError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import {
    idField,
    lowerItemTypeIdField,
    connectionTypeIdField,
    upperItemTypeIdField,
    validationExpressionField,
    maxConnectionsToLowerField,
    maxConnectionsToUpperField,
    upperIdField,
    lowerIdField,
} from '../../util/fields.constants';
import socket from '../socket.controller';
import { connectionRuleCtx, createAction, updateAction, deleteAction } from '../../util/socket.constants';
import {
    connectionRuleModelCanDelete,
    connectionRuleModelCreate,
    connectionRuleModelDelete,
    connectionRuleModelFind,
    connectionRuleModelFindAll,
    connectionRuleModelFindOne,
    connectionRuleModelFindSingle,
    connectionRuleModelUpdate,
} from './connection-rule.al';
import { connectionModelCountByFilter } from '../item-data/connection.al';

// read
export function getConnectionRules(req: Request, res: Response, next: NextFunction) {
    connectionRuleModelFindAll()
        .then((connectionRules) => res.json(connectionRules))
        .catch((error: any) => serverError(next, error));
}

export function getConnectionRulesForItemType(req: Request, res: Response, next: NextFunction) {
    connectionRuleModelFind({ $or: [{ upperItemType: req.params[idField] }, { lowerItemType: req.params[idField] }] })
        .then((connectionRules) => res.json(connectionRules))
        .catch((error: any) => serverError(next, error));
}

export function getConnectionRulesForUpperItemType(req: Request, res: Response, next: NextFunction) {
    connectionRuleModelFind({ upperItemType: req.params[idField] })
        .then((connectionRules) => res.json(connectionRules))
        .catch((error: any) => serverError(next, error));
}

export function getConnectionRulesForLowerItemType(req: Request, res: Response, next: NextFunction) {
    connectionRuleModelFind({ lowerItemType: req.params[idField] })
        .then((connectionRules) => res.json(connectionRules))
        .catch((error: any) => serverError(next, error));
}

export function getConnectionRulesForUpperAndLowerItemType(req: Request, res: Response, next: NextFunction) {
    connectionRuleModelFind({ upperItemType: req.params[upperIdField], lowerItemType: req.params[lowerIdField] })
        .then((connectionRules) => res.json(connectionRules))
        .catch((error: any) => serverError(next, error));
}

export function getConnectionRule(req: Request, res: Response, next: NextFunction) {
    connectionRuleModelFindSingle(req.params[idField])
        .then((connectionRule) => res.json(connectionRule))
        .catch((error: any) => serverError(next, error));
}

export function getConnectionRuleByContent(req: Request, res: Response, next: NextFunction) {
    const upperItemType = req.params[upperIdField];
    const lowerItemType = req.params[lowerIdField];
    const connectionType = req.params[connectionTypeIdField];
    connectionRuleModelFindOne({ upperItemType, lowerItemType, connectionType, })
        .then((connectionRule) => res.json(connectionRule))
        .catch((error: any) => serverError(next, error));

}

export function getConnectionsCountForConnectionRule(req: Request, res: Response, next: NextFunction) {
    connectionModelCountByFilter({ connectionRule: req.params[idField] })
        .then((docs) => res.json(docs))
        .catch((error: any) => serverError(next, error));
}

// create
export function createConnectionRule(req: Request, res: Response, next: NextFunction) {
    const connectionType = req.body[connectionTypeIdField] as string;
    const upperItemType = req.body[upperItemTypeIdField] as string;
    const lowerItemType = req.body[lowerItemTypeIdField] as string;
    const validationExpression = req.body[validationExpressionField] as string;
    const maxConnectionsToLower = +req.body[maxConnectionsToLowerField];
    const maxConnectionsToUpper = +req.body[maxConnectionsToUpperField];
    connectionRuleModelCreate(connectionType, upperItemType, lowerItemType, validationExpression, maxConnectionsToLower, maxConnectionsToUpper)
        .then(connectionRule => {
            socket.emit(createAction, connectionRuleCtx, connectionRule);
            return res.status(201).json(connectionRule);
        })
        .catch((error: any) => serverError(next, error));
}

// update
export function updateConnectionRule(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField];
    const upperItemTypeId = req.body[upperItemTypeIdField] as string;
    const lowerItemTypeId = req.body[lowerItemTypeIdField] as string;
    const connectionTypeId = req.body[connectionTypeIdField] as string;
    const maxConnectionsToLower = +req.body[maxConnectionsToLowerField];
    const maxConnectionsToUpper = +req.body[maxConnectionsToUpperField];
    const validationExpression = req.body[validationExpressionField] as string;
    connectionRuleModelUpdate(id, connectionTypeId, upperItemTypeId, lowerItemTypeId, validationExpression,
        maxConnectionsToLower, maxConnectionsToUpper)
        .then((connectionRule) => {
            if (connectionRule) {
                socket.emit(updateAction, connectionRuleCtx, connectionRule);
                return res.json(connectionRule);
            }
        })
        .catch((error: HttpError) => {
            if (error.httpStatusCode === 304) {
                res.sendStatus(304);
                return;
            }
            serverError(next, error)
        });
}

// delete
export function deleteConnectionRule(req: Request, res: Response, next: NextFunction) {
    connectionRuleModelDelete(req.params[idField])
        .then((connectionRule) => {
            if (connectionRule) {
                socket.emit(deleteAction, connectionRuleCtx, connectionRule);
                return res.json(connectionRule);
            }
        })
        .catch((error: any) => serverError(next, error));
}

export function canDeleteConnectionRule(req: Request, res: Response, next: NextFunction) {
    connectionRuleModelCanDelete(req.params[idField])
        .then(canDelete => {
            res.json(canDelete);
        })
        .catch((error: any) => serverError(next, error));
}
