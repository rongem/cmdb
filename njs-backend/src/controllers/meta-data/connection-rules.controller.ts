import { Request, Response, NextFunction } from 'express';

import connectionRuleModel from '../../models/mongoose/connection-rule.model';
import connectionModel from '../../models/mongoose/connection.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { handleValidationErrors } from '../../routes/validators';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';

// read
export function getConnectionRules(req: Request, res: Response, next: NextFunction) {
    connectionRuleModel.find()
        .then(crs => res.json(crs.map(cr => new ConnectionRule(cr))))
        .catch(error => serverError(next, error));
}

export function getConnectionRulesForItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.find({$or: [{upperItemType: req.params.id}, {lowerItemType: req.params.id}]})
        .then(crs => res.json(crs.map(cr => new ConnectionRule(cr))))
        .catch(error => serverError(next, error))
}

export function getConnectionRulesForUpperItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.find({upperItemType: req.params.id})
        .then(crs => res.json(crs.map(cr => new ConnectionRule(cr))))
        .catch(error => serverError(next, error))
}

export function getConnectionRulesForLowerItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.find({lowerItemType: req.params.id})
        .then(crs => res.json(crs.map(cr => new ConnectionRule(cr))))
        .catch(error => serverError(next, error))
}

export function getConnectionRulesForUpperAndLowerItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.find({upperItemType: req.params.upperid, lowerItemType: req.params.lowerid})
        .then(crs => res.json(crs.map(cr => new ConnectionRule(cr))))
        .catch(error => serverError(next, error))
}

export function getConnectionRule(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.findById(req.params.id)
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
        upperItemType: req.params.upperid,
        lowerItemType: req.params.lowerid,
        connectionType: req.params.ctid,
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
    connectionModel.find({connectionRule:  req.params.id}).estimatedDocumentCount()
        .then(value => res.json(value))
        .catch(error => serverError(next, error))
}

// create
export function createConnectionRule(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.create({
        connectionType: req.body.connectionType,
        upperItemType: req.body.upperItemType,
        lowerItemType: req.body.lowerItemType,
        validationExpression: req.body.validationExpression,
        maxConnectionsToLower: req.body.maxConnectionsToLower,
        maxConnectionsToUpper: req.body.maxConnectionsToUpper,
    }).then(connectionRule => {
        const cr = new ConnectionRule(connectionRule);
        socket.emit('connection-rules', 'create', cr);
        return res.status(201).json(cr);
    })
    .catch(error => serverError(next, error))
}

// update
export function updateConnectionRule(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.findById(req.params.id)
        .then(connectionRule => {
            if (!connectionRule) {
                throw notFoundError;
            }
            if (connectionRule.upperItemType.toString() !== req.body.upperItemType ||
                connectionRule.lowerItemType.toString() !== req.body.lowerItemType ||
                connectionRule.connectionType.toString() !== req.body.connectionType)
            {
                throw new HttpError(422, "Changing types is not allowed.");
            }
            let changed = false;
            if (connectionRule.maxConnectionsToLower !== req.body.maxConnectionsToLower) {
                connectionRule.maxConnectionsToLower = req.body.maxConnectionsToLower;
                changed = true;
            }
            if (connectionRule.maxConnectionsToLower !== req.body.maxConnectionsToLower) {
                connectionRule.maxConnectionsToLower = req.body.maxConnectionsToLower;
                changed = true;
            }
            if (connectionRule.validationExpression !== req.body.validationExpression) {
                connectionRule.validationExpression = req.body.validationExpression;
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
                socket.emit('connection-rules', 'update', cr);
                return res.json(cr);
            }
        })
        .catch(error => serverError(next, error));
}

// delete
export function deleteConnectionRule(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    connectionRuleModel.findById(req.params.id)
        .then(connectionRule => {
            if (!connectionRule) {
                throw notFoundError;
            }
            return connectionModel.find({connectionRule: connectionRule._id}).estimatedDocumentCount()
                .then(value => {
                    if (value > 0) {
                        next(new HttpError(409, 'Connection rule is still used by connections.'));
                        return;
                    }
                    return connectionRule.remove();
                })
        })
        .then(connectionRule => {
            if (connectionRule) {
                const cr = new ConnectionRule(connectionRule);
                socket.emit('connection-rules', 'delete', cr);
                return res.json(cr);
            }
        })
        .catch(error => serverError(next, error));
}

export function canDeleteConnectionRule(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    return connectionModel.find({connectionRule: req.params.id}).estimatedDocumentCount()
        .then(value => value === 0)
        .catch(error => serverError(next, error));
}
