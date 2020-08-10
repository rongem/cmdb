import { Request, Response, NextFunction } from 'express';

import connectionRuleModel from '../../models/mongoose/connection-rule.model';
import connectionModel from '../../models/mongoose/connection.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { handleValidationErrors } from '../../routes/validators';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';
import {
    idField,
    lowerItemTypeField,
    connectionTypeField,
    upperItemTypeField,
    validationExpressionField,
    maxConnectionsToLowerField,
    maxConnectionsToUpperField,
    upperIdField,
    lowerIdField,
    connectionTypeIdfield,
} from '../../util/fields.constants';
import { disallowedChangingOfTypesMsg, disallowedDeletionOfConnectionRuleMsg } from '../../util/messages.constants';
import { connectionRuleCat, createCtx, updateCtx, deleteCtx } from '../../util/socket.constants';

// read
export function getConnectionRules(req: Request, res: Response, next: NextFunction) {
    connectionRuleModel.find()
        .then(crs => res.json(crs.map(cr => new ConnectionRule(cr))))
        .catch(error => serverError(next, error));
}

export function getConnectionRulesForItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.find({ $or: [{ upperItemType: req.params[idField] }, { lowerItemType: req.params[idField] }] })
        .then(crs => res.json(crs.map(cr => new ConnectionRule(cr))))
        .catch(error => serverError(next, error))
}

export function getConnectionRulesForUpperItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.find({ upperItemType: req.params[idField] })
        .then(crs => res.json(crs.map(cr => new ConnectionRule(cr))))
        .catch(error => serverError(next, error))
}

export function getConnectionRulesForLowerItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.find({ lowerItemType: req.params[idField] })
        .then(crs => res.json(crs.map(cr => new ConnectionRule(cr))))
        .catch(error => serverError(next, error))
}

export function getConnectionRulesForUpperAndLowerItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.find({ upperItemType: req.params[upperIdField], lowerItemType: req.params[lowerIdField] })
        .then(crs => res.json(crs.map(cr => new ConnectionRule(cr))))
        .catch(error => serverError(next, error))
}

export function getConnectionRule(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.findById(req.params[idField])
        .then(connectionRule => {
            if (!connectionRule) {
                throw notFoundError;
            }
            return res.json(new ConnectionRule(connectionRule));
        })
        .catch(error => serverError(next, error))
}

export function getConnectionRuleByContent(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.findOne({
        upperItemType: req.params[upperIdField],
        lowerItemType: req.params[lowerIdField],
        connectionType: req.params[connectionTypeIdfield],
    }).then(cr => {
        if (!cr) {
            throw notFoundError;
        }
        return res.json(new ConnectionRule(cr));
    })
        .catch(error => serverError(next, error))

}

export function getConnectionsCountForConnectionRule(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionModel.find({ connectionRule: req.params[idField] }).estimatedDocumentCount()
        .then(value => res.json(value))
        .catch(error => serverError(next, error))
}

// create
export function createConnectionRule(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.create({
        connectionType: req.body[connectionTypeField],
        upperItemType: req.body[upperItemTypeField],
        lowerItemType: req.body[lowerItemTypeField],
        validationExpression: req.body[validationExpressionField],
        maxConnectionsToLower: req.body[maxConnectionsToLowerField],
        maxConnectionsToUpper: req.body[maxConnectionsToUpperField],
    }).then(connectionRule => {
        const cr = new ConnectionRule(connectionRule);
        socket.emit(connectionRuleCat, createCtx, cr);
        return res.status(201).json(cr);
    })
        .catch(error => serverError(next, error))
}

// update
export function updateConnectionRule(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.findById(req.params[idField])
        .then(connectionRule => {
            if (!connectionRule) {
                throw notFoundError;
            }
            if (connectionRule.upperItemType.toString() !== req.body[upperItemTypeField] ||
                connectionRule.lowerItemType.toString() !== req.body[lowerItemTypeField] ||
                connectionRule.connectionType.toString() !== req.body[connectionTypeField]) {
                throw new HttpError(422, disallowedChangingOfTypesMsg, {
                    oldUpperItemType: connectionRule.upperItemType.toString() !== req.body[upperItemTypeField] ?
                        connectionRule.upperItemType.toString() : undefined,
                    newUpperItemType: connectionRule.upperItemType.toString() !== req.body[upperItemTypeField] ?
                        req.body[upperItemTypeField] : undefined,
                    oldLowerItemType: connectionRule.upperItemType.toString() !== req.body[upperItemTypeField] ?
                        connectionRule.lowerItemType.toString() : undefined,
                    newLowerItemType: connectionRule.upperItemType.toString() !== req.body[upperItemTypeField] ?
                        req.body[lowerItemTypeField] : undefined,
                    oldConnectionType: connectionRule.connectionType.toString() !== req.body[connectionTypeField] ?
                        connectionRule.connectionType.toString() : undefined,
                    newConnectionType: connectionRule.connectionType.toString() !== req.body[connectionTypeField] ?
                        req.body[connectionTypeField] : undefined,
                });
            }
            let changed = false;
            if (connectionRule.maxConnectionsToLower !== req.body[maxConnectionsToLowerField]) {
                connectionRule.maxConnectionsToLower = req.body[maxConnectionsToLowerField];
                changed = true;
            }
            if (connectionRule.maxConnectionsToLower !== req.body[maxConnectionsToLowerField]) {
                connectionRule.maxConnectionsToLower = req.body[maxConnectionsToLowerField];
                changed = true;
            }
            if (connectionRule.validationExpression !== req.body[validationExpressionField]) {
                connectionRule.validationExpression = req.body[validationExpressionField];
                changed = true;
            }
            if (!changed) {
                res.sendStatus(304);
                return;
            }
            return connectionRule.save();
        })
        .then(connectionRule => {
            if (connectionRule) {
                const cr = new ConnectionRule(connectionRule);
                socket.emit(connectionRuleCat, updateCtx, cr);
                return res.json(cr);
            }
        })
        .catch(error => serverError(next, error));
}

// delete
export function deleteConnectionRule(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.findById(req.params[idField])
        .then(async connectionRule => {
            if (!connectionRule) {
                throw notFoundError;
            }
            const value = await connectionModel.find({ connectionRule: connectionRule._id }).estimatedDocumentCount();
            if (value > 0) {
                next(new HttpError(409, disallowedDeletionOfConnectionRuleMsg));
                return;
            }
            return connectionRule.remove();
        })
        .then(connectionRule => {
            if (connectionRule) {
                const cr = new ConnectionRule(connectionRule);
                socket.emit(connectionRuleCat, deleteCtx, cr);
                return res.json(cr);
            }
        })
        .catch(error => serverError(next, error));
}

export function canDeleteConnectionRule(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    return connectionModel.find({ connectionRule: req.params[idField] }).estimatedDocumentCount()
        .then(value => res.json(value === 0))
        .catch(error => serverError(next, error));
}
