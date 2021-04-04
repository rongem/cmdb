import { connectionRuleModel, IConnectionRule } from '../../models/mongoose/connection-rule.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import {
    disallowedChangingOfTypesMsg,
    disallowedDeletionOfConnectionRuleMsg,
    invalidDescriptionMsg,
    maximumNumberOfConnectionsToLowerToSmallMsg,
    maximumNumberOfConnectionsToUpperToSmallMsg,
    nothingChangedMsg,
} from '../../util/messages.constants';
import { connectionModelFind, connectionsCountByFilter } from '../item-data/connection.al';

export function connectionRuleModelFindAll(): Promise<ConnectionRule[]> {
    return connectionRuleModel.find()
        .then((connectionRules: IConnectionRule[]) => connectionRules.map(cr => new ConnectionRule(cr)));
}

export function connectionRuleModelFind(filter: any): Promise<ConnectionRule[]> {
    return connectionRuleModel.find(filter)
        .then(connectionRules => connectionRules.map(cr => new ConnectionRule(cr)));
}

export function connectionRuleModelFindByContent(upperItemType: string, lowerItemType: string, connectionType: string) {
    return connectionRuleModelFindOne({upperItemType, lowerItemType, connectionType});
}

export async function connectionRuleModelFindOne(filter: any) {
    const connectionRule = await connectionRuleModel.findOne(filter);
    if (!connectionRule) {
        throw notFoundError;
    }
    return new ConnectionRule(connectionRule);
}

export async function connectionRuleModelFindSingle(id: string) {
    const connectionRule = await connectionRuleModel.findById(id);
    if (!connectionRule) {
        throw notFoundError;
    }
    return new ConnectionRule(connectionRule);
}

export async function connectionRuleModelSingleExists(id: string) {
    const count: number = await connectionRuleModel.findById(id).countDocuments();
    return count > 0;
}

export async function connectionRuleCountByFilter(filter: any) {
    const rules = +(await connectionRuleModel.find(filter).countDocuments());
    return rules;
}

export async function connectionRuleModelCreate(connectionTypeId: string, upperItemTypeId: string, lowerItemType: string, validationExpression: string,
                                                maxConnectionsToLower: number, maxConnectionsToUpper: number) {
    const connectionRule = await connectionRuleModel.create({
        connectionType: connectionTypeId,
        upperItemType: upperItemTypeId,
        lowerItemType,
        validationExpression,
        maxConnectionsToLower,
        maxConnectionsToUpper,
    });
    return new ConnectionRule(connectionRule);
}

export async function connectionRuleModelUpdate(id: string, connectionTypeId: string, upperItemTypeId: string, lowerItemTypeId: string,
                                                validationExpression: string, maxConnectionsToLower: number, maxConnectionsToUpper: number) {
    let [connectionRule, connections] = await Promise.all([
        connectionRuleModel.findById(id),
        connectionModelFind({connectionRule: id}),
    ]);
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
    const upperItemIds = connections.map(c => c.upperItemId);
    const uniqueUpperItemIds = [...new Set(upperItemIds)];
    const lowerItemIds = connections.map(c => c.lowerItemId);
    const uniqueLowerItemIds = [...new Set(lowerItemIds)];
    const descriptions = [...new Set(connections.map(c => c.description))];
    if (connectionRule.maxConnectionsToLower !== maxConnectionsToLower) {
        // check if there are more connections than allowed
        if (uniqueUpperItemIds.some(id => upperItemIds.filter(i => i === id).length > maxConnectionsToLower)) {
            throw new HttpError(409, maximumNumberOfConnectionsToLowerToSmallMsg);
        }
        connectionRule.maxConnectionsToLower = maxConnectionsToLower;
        changed = true;
    }
    if (connectionRule.maxConnectionsToUpper !== maxConnectionsToUpper) {
        // check if there are more connections than allowed
        if (uniqueLowerItemIds.some(id => lowerItemIds.filter(i => i === id).length > maxConnectionsToUpper)) {
            throw new HttpError(409, maximumNumberOfConnectionsToUpperToSmallMsg);
        }
        connectionRule.maxConnectionsToUpper = maxConnectionsToUpper;
        changed = true;
    }
    if (connectionRule.validationExpression !== validationExpression) {
        // check if there are connection descriptions that do not comply to the new rule
        const regEx = new RegExp(validationExpression);
        const disallowedDescriptions = descriptions.filter(d => !regEx.test(d));
        if (disallowedDescriptions.length > 0) {
            throw new HttpError(409, invalidDescriptionMsg, {errors: disallowedDescriptions})
        }
        connectionRule.validationExpression = validationExpression;
        changed = true;
    }
    if (!changed) {
        throw new HttpError(304, nothingChangedMsg);
    }
    connectionRule = await connectionRule.save();
    return new ConnectionRule(connectionRule);
}

export async function connectionRuleModelDelete(id: string) {
    let connectionRule: IConnectionRule | null;
    let canDelete: boolean;
    [connectionRule, canDelete] = await Promise.all([
        connectionRuleModel.findById(id),
        connectionRuleModelCanDelete(id),
    ]);
    if (!connectionRule) {
        throw notFoundError;
    }
    if (!canDelete) {
        throw new HttpError(422, disallowedDeletionOfConnectionRuleMsg);
    }
    connectionRule = await connectionRule.remove();
    return new ConnectionRule(connectionRule);
}

export async function connectionRuleModelCanDelete(connectionRule: string) {
    const docs = await connectionsCountByFilter({ connectionRule });
    return docs === 0;
}
