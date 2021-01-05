import { Request, Response, NextFunction } from 'express';

import { connectionRuleModel, IConnectionRule } from '../../models/mongoose/connection-rule.model';
import { connectionModel } from '../../models/mongoose/connection.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';
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
import { disallowedChangingOfTypesMsg, disallowedDeletionOfConnectionRuleMsg } from '../../util/messages.constants';
import { connectionRuleCat, createCtx, updateCtx, deleteCtx } from '../../util/socket.constants';

// read
export function getConnectionRules(req: Request, res: Response, next: NextFunction) {
    connectionRuleModel.find()
        .then((crs: IConnectionRule[]) => res.json(crs.map(cr => new ConnectionRule(cr))))
        .catch((error: any) => serverError(next, error));
}

export function getConnectionRulesForItemType(req: Request, res: Response, next: NextFunction) {
    connectionRuleModel.find({ $or: [{ upperItemType: req.params[idField] }, { lowerItemType: req.params[idField] }] })
        .then((crs: IConnectionRule[]) => res.json(crs.map(cr => new ConnectionRule(cr))))
        .catch((error: any) => serverError(next, error));
}

export function getConnectionRulesForUpperItemType(req: Request, res: Response, next: NextFunction) {
    connectionRuleModel.find({ upperItemType: req.params[idField] })
        .then((crs: IConnectionRule[]) => res.json(crs.map(cr => new ConnectionRule(cr))))
        .catch((error: any) => serverError(next, error));
}

export function getConnectionRulesForLowerItemType(req: Request, res: Response, next: NextFunction) {
    connectionRuleModel.find({ lowerItemType: req.params[idField] })
        .then((crs: IConnectionRule[]) => res.json(crs.map(cr => new ConnectionRule(cr))))
        .catch((error: any) => serverError(next, error));
}

export function getConnectionRulesForUpperAndLowerItemType(req: Request, res: Response, next: NextFunction) {
    connectionRuleModel.find({ upperItemType: req.params[upperIdField], lowerItemType: req.params[lowerIdField] })
        .then((crs: IConnectionRule[]) => res.json(crs.map(cr => new ConnectionRule(cr))))
        .catch((error: any) => serverError(next, error));
}

export function getConnectionRule(req: Request, res: Response, next: NextFunction) {
    connectionRuleModel.findById(req.params[idField])
        .then((connectionRule: IConnectionRule) => {
            if (!connectionRule) {
                throw notFoundError;
            }
            return res.json(new ConnectionRule(connectionRule));
        })
        .catch((error: any) => serverError(next, error));
}

export function getConnectionRuleByContent(req: Request, res: Response, next: NextFunction) {
    connectionRuleModel.findOne({
        upperItemType: req.params[upperIdField],
        lowerItemType: req.params[lowerIdField],
        connectionType: req.params[connectionTypeIdField],
    }).then((connectionRule: IConnectionRule) => {
        if (!connectionRule) {
            throw notFoundError;
        }
        return res.json(new ConnectionRule(connectionRule));
    })
        .catch((error: any) => serverError(next, error));

}

export function getConnectionsCountForConnectionRule(req: Request, res: Response, next: NextFunction) {
    connectionModel.find({ connectionRule: req.params[idField] }).countDocuments()
        .then((docs: number) => res.json(docs))
        .catch((error: any) => serverError(next, error));
}

// create
export function createConnectionRule(req: Request, res: Response, next: NextFunction) {
    connectionRuleModel.create({
        connectionType: req.body[connectionTypeIdField],
        upperItemType: req.body[upperItemTypeIdField],
        lowerItemType: req.body[lowerItemTypeIdField],
        validationExpression: req.body[validationExpressionField],
        maxConnectionsToLower: req.body[maxConnectionsToLowerField],
        maxConnectionsToUpper: req.body[maxConnectionsToUpperField],
    }).then(connectionRule => {
        const cr = new ConnectionRule(connectionRule);
        socket.emit(connectionRuleCat, createCtx, cr);
        return res.status(201).json(cr);
    })
        .catch((error: any) => serverError(next, error));
}

// update
export function updateConnectionRule(req: Request, res: Response, next: NextFunction) {
    const upperItemTypeId = req.body[upperItemTypeIdField] as string;
    const lowerItemTypeId = req.body[lowerItemTypeIdField] as string;
    const connectionTypeId = req.body[connectionTypeIdField] as string;
    const maxConnectionsToLower = +req.body[maxConnectionsToLowerField];
    const maxConnectionsToUpper = +req.body[maxConnectionsToUpperField];
    const validationExpression = req.body[validationExpressionField] as string;
    connectionRuleModel.findById(req.params[idField])
        .then((connectionRule: IConnectionRule) => {
            if (!connectionRule) {
                throw notFoundError;
            }
            if (connectionRule.upperItemType.toString() !== upperItemTypeId ||
                connectionRule.lowerItemType.toString() !== lowerItemTypeId ||
                connectionRule.connectionType.toString() !== connectionTypeId) {
                throw new HttpError(422, disallowedChangingOfTypesMsg, {
                    oldUpperItemType: connectionRule.upperItemType.toString() !== upperItemTypeId ?
                        connectionRule.upperItemType.toString() : undefined,
                    newUpperItemType: connectionRule.upperItemType.toString() !== upperItemTypeId ? upperItemTypeId : undefined,
                    oldLowerItemType: connectionRule.lowerItemType.toString() !== lowerItemTypeId ?
                        connectionRule.lowerItemType.toString() : undefined,
                    newLowerItemType: connectionRule.lowerItemType.toString() !== lowerItemTypeId ? lowerItemTypeId : undefined,
                    oldConnectionType: connectionRule.connectionType.toString() !== connectionTypeId ?
                        connectionRule.connectionType.toString() : undefined,
                    newConnectionType: connectionRule.connectionType.toString() !== connectionTypeId ? connectionTypeId : undefined,
                });
            }
            let changed = false;
            if (connectionRule.maxConnectionsToLower !== maxConnectionsToLower) {
                // tbd: check if there are more connections than allowed
                connectionRule.maxConnectionsToLower = maxConnectionsToLower;
                changed = true;
            }
            if (connectionRule.maxConnectionsToUpper !== maxConnectionsToUpper) {
                // tbd: check if there are more connections than allowed
                connectionRule.maxConnectionsToUpper = maxConnectionsToUpper;
                changed = true;
            }
            if (connectionRule.validationExpression !== validationExpression) {
                // tbd: check if there are connection descriptions that do not comply to the new rule
                connectionRule.validationExpression = validationExpression;
                changed = true;
            }
            if (!changed) {
                res.sendStatus(304);
                return;
            }
            return connectionRule.save();
        })
        .then((connectionRule: IConnectionRule) => {
            if (connectionRule) {
                const cr = new ConnectionRule(connectionRule);
                socket.emit(connectionRuleCat, updateCtx, cr);
                return res.json(cr);
            }
        })
        .catch((error: any) => serverError(next, error));
}

// delete
export function deleteConnectionRule(req: Request, res: Response, next: NextFunction) {
    connectionRuleModel.findById(req.params[idField])
        .then(async (connectionRule: IConnectionRule) => {
            if (!connectionRule) {
                throw notFoundError;
            }
            const value = await connectionModel.find({ connectionRule: connectionRule._id }).countDocuments();
            if (value > 0) {
                next(new HttpError(409, disallowedDeletionOfConnectionRuleMsg));
                return;
            }
            return connectionRule.remove();
        })
        .then((connectionRule: IConnectionRule) => {
            if (connectionRule) {
                const cr = new ConnectionRule(connectionRule);
                socket.emit(connectionRuleCat, deleteCtx, cr);
                return res.json(cr);
            }
        })
        .catch((error: any) => serverError(next, error));
}

export function canDeleteConnectionRule(req: Request, res: Response, next: NextFunction) {
    connectionModel.find({ connectionRule: req.params[idField] }).countDocuments()
        .then((docs: number) => res.json(docs === 0))
        .catch((error: any) => serverError(next, error));
}
