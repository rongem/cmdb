import { IAttributeType } from '../../models/mongoose/attribute-type.model';
import { IItemType } from '../../models/mongoose/item-type.model';
import { IUser } from '../../models/mongoose/user.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { Connection } from '../../models/item-data/connection.model';
import { connectionModelCreate, connectionModelFindOne } from './connection.al';
import { connectionRuleModelCreate, connectionRuleModelFindByContent } from '../meta-data/connection-rule.al';
import { itemTypeModelCreate, itemTypeModelFind, itemTypeModelFindOne } from '../meta-data/item-type.al';
import {
    configurationItemModelCreate,
    configurationItemModelFind,
    configurationItemModelFindOne,
    configurationItemModelUpdate
} from './configuration-item.al';
import { ItemAttribute } from '../../models/item-data/item-attribute.model';
import { HttpError } from '../../rest-api/httpError.model';
import { attributeTypeModelDelete } from '../meta-data/attribute-type.al';
import {
    idField,
} from '../../util/fields.constants';
import { IConnectionRule, connectionRuleModel } from '../../models/mongoose/connection-rule.model';
import { IConnection, connectionModel } from '../../models/mongoose/connection.model';
import { notFoundError } from '../error.controller';

export async function modelConvertAttributeTypeToItemType(id: string, newItemTypeName: string,
                                                          attributeType: IAttributeType, attributeTypes: IAttributeType[], attributeGroup: string,
                                                          connectionTypeId: string, color: string, newItemIsUpperType: boolean,
                                                          authentication: IUser) {
    const allowedItemTypes = await itemTypeModelFind({ attributeGroups: {$elemMatch: attributeGroup} });
    const newItemType = await getOrCreateItemType(newItemTypeName,
        color, [...new Set(attributeTypes.map(a => a.attributeGroup))]);
    const changedItems = [];
    const changedConnections = [];
    const attributeItemMap = new Map<string, ConfigurationItem>();
    // tslint:disable: prefer-for-of
    for (let index = 0; index < allowedItemTypes.length; index++) {
        const targetItemType = allowedItemTypes[index];
        const upperType = newItemIsUpperType ? newItemType : targetItemType;
        const lowerType = newItemIsUpperType ? targetItemType : newItemType;
        const connectionRule = await getOrCreateConnectionRule(upperType, lowerType, connectionTypeId);
        const items: ConfigurationItem[] = await configurationItemModelFind({type: targetItemType.id, 'attributes.type': attributeType._id});
        const attributeValues = getUniqueAttributeValues(items, attributeType._id.toString());
        // go through all unique attribute values and create items from them
        for (let j = 0; j < attributeValues.length; j++) {
            let targetItem: ConfigurationItem;
            const sourceItems = items.filter(i => i.attributes.some(a => a.typeId === id &&
                a.value.toLocaleLowerCase() === attributeValues[j].toLocaleLowerCase()));
            const accompanyingAttributes = sourceItems[0].attributes.filter(a => attributeTypes.map(t => t.id).includes(a.typeId));
            // check if item exists (maybe from a former run) or create it
            if (attributeItemMap.has(attributeValues[j].toLocaleLowerCase())) {
                targetItem = attributeItemMap.get(attributeValues[j].toLocaleLowerCase())!;
            } else {
                targetItem = await getOrCreateConfigurationItem(attributeValues[j], targetItemType.id!, accompanyingAttributes, authentication);
                attributeItemMap.set(attributeValues[j].toLocaleLowerCase(), targetItem);
            }
            changedItems.push(targetItem);
            // create connections for all the items with the attribute of that value
            for (let k = 0; k < sourceItems.length; k++) {
                const sourceItem = sourceItems[k];
                let newConnection;
                if (newItemIsUpperType) {
                    newConnection = await getOrCreateConnection(targetItem.id!, sourceItem.id!, connectionRule.id!, '', authentication);
                } else {
                    newConnection = await getOrCreateConnection(sourceItem.id!, targetItem.id!, connectionRule.id!, '', authentication);
                }
                // after creation, delete attribute and all accompanying attributes in the items
                if (newConnection) {
                    changedConnections.push(new Connection(newConnection));
                    sourceItem.attributes = sourceItem.attributes.filter(a => a.typeId !== attributeType.id &&
                        !accompanyingAttributes.map(aa => aa.typeId).includes(a.typeId));
                    const changedItem = await configurationItemModelUpdate(authentication, sourceItem.id, sourceItem.name, sourceItem.typeId,
                        sourceItem.responsibleUsers, sourceItem.attributes, sourceItem.links);
                    changedItems.push(changedItem);
                }
            }
        }
    }
    // after finishing creation of items, check if attributes of that type still exist. If not, delete the attribute type
    const itemsWithAttributeType = await configurationItemModelFind({'attributes.type': attributeType._id});
    if (itemsWithAttributeType.length > 0) {
        throw new HttpError(500, 'Did not remove all attributes, something went wrong.', itemsWithAttributeType);
    }
    const deletedAttributeType = await attributeTypeModelDelete(attributeType.id);
    return {
        itemType: newItemType,
        items: changedItems,
        connections: changedConnections,
        deletedAttributeType,
    };
}

function getUniqueAttributeValues(items: ConfigurationItem[], attributeTypeId: string) {
    const attributeValues = [...new Set(items.map(i => (i.attributes.find(a => a.typeId === attributeTypeId) as ItemAttribute).value))];
    const lowerAttributeValues = [...new Set(attributeValues.map(v => v.toLocaleLowerCase()))];
    if (lowerAttributeValues.length < attributeValues.length) {
        lowerAttributeValues.forEach(av => {
            const duplicateValues = attributeValues.filter(a => a.toLocaleLowerCase() === av);
            if (duplicateValues.length > 1) {
                for (let x = 1; x < duplicateValues.length; x++) {
                    attributeValues.splice(attributeValues.indexOf(duplicateValues[x]), 1);
                }
            }
        });
    }
    return attributeValues;
}

async function getOrCreateConnection(upperItem: string, lowerItem: string, connectionRule: string, description: string, creator: IUser) {
    let connection = await connectionModelFindOne(upperItem, lowerItem, connectionRule);
    if (!connection) {
        connection = await connectionModelCreate(undefined, connectionRule, upperItem, lowerItem, description, creator);
    }
    return connection;
}

async function getOrCreateConfigurationItem(name: string, type: string, attributes: ItemAttribute[], creator: IUser) {
    let item = await configurationItemModelFindOne(name, type);
    if (!item) {
        item = await configurationItemModelCreate([creator.name], creator.id!, creator, name, type,
            attributes.map(a => ({...a, _id: undefined})), []);
    }
    return item;
}

async function getOrCreateItemType(name: string, color: string, attributeGroups: {[idField]: string}[]) {
    let newItemType = await itemTypeModelFindOne(name);
    if (!newItemType) {
        newItemType = await itemTypeModelCreate(name, color, attributeGroups.map(ag => ag[idField]));
    }
    return newItemType;
}

async function getOrCreateConnectionRule(upperType: IItemType, lowerType: IItemType, connectionTypeId: string) {
    let connectionRule = await connectionRuleModelFindByContent(upperType._id, lowerType._id, connectionTypeId);
    if (!connectionRule) {
        connectionRule = await connectionRuleModelCreate(connectionTypeId, lowerType._id, upperType._id, '^.*$', 9999, 9999);
    }
    return connectionRule;
}

export async function modelGetItemsConnectableAsUpperItem(connectionRuleId: string, itemId: string) {
    const connectionRule: IConnectionRule = await connectionRuleModel.findById(connectionRuleId);
    if (!connectionRule) {
      throw notFoundError;
    }
    const items = await configurationItemModelFind({ type: connectionRule.upperItemType, _id: {$not: itemId} });
    const existingItemIds: string[] = items.map(i => i.id);
    const connections: IConnection[] = await connectionModel.find({upperItem: { $in: existingItemIds }, lowerItem: {$not: itemId} } );
    const allowedItemIds: string[] = [];
    if (connections.length > 0) {
      existingItemIds.forEach(id => {
        if (connectionRule.maxConnectionsToLower > connections.filter(c => c.upperItem.toString() === id).length) {
          allowedItemIds.push(id);
        }
      });
      return items.filter(item => allowedItemIds.includes(item.id));
    }
    return items;
}

export async function availableItemsForConnectionRuleAndCount(connectionRule: string, itemsCountToConnect: number) {
}
