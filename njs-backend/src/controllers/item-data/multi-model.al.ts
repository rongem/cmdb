import { IAttributeType } from '../../models/mongoose/attribute-type.model';
import { IItemType, itemTypeModel } from '../../models/mongoose/item-type.model';
import { IUser } from '../../models/mongoose/user.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { Connection } from '../../models/item-data/connection.model';
import { connectionRuleModel, IConnectionRule, IConnectionRulePopulated } from '../../models/mongoose/connection-rule.model';
import { notFoundError } from '../../controllers/error.controller';
import { IConfigurationItem, configurationItemModel, IConfigurationItemPopulated } from '../../models/mongoose/configuration-item.model';
import { connectionModel, IConnection, IConnectionPopulated } from '../../models/mongoose/connection.model';
import { connectionModelCreate, connectionModelFind, connectionModelFindOne, logAndRemoveConnection } from './connection.al';
import { connectionRuleModelCreate, connectionRuleModelFindByContent, connectionRuleModelFindSingle } from '../meta-data/connection-rule.al';
import { itemTypeModelCreate, itemTypeModelFind, itemTypeModelFindOne } from '../meta-data/item-type.al';
import {
    configurationItemModelCreate,
    configurationItemModelFind,
    configurationItemModelFindOne,
    configurationItemModelUpdate,
    getHistoricItem,
    updateItemHistory
} from './configuration-item.al';
import { ItemAttribute } from '../../models/item-data/item-attribute.model';
import { HttpError } from '../../rest-api/httpError.model';
import { attributeTypeModelDelete } from '../meta-data/attribute-type.al';
import {
    attributesField,
    connectionRuleField,
    connectionTypeField,
    idField,
    lowerItemField,
    nameField,
    responsibleUsersField,
    typeField,
    upperItemField,
} from '../../util/fields.constants';
import { checkResponsibility } from '../../routes/validators';
import { MongooseFilterQuery } from 'mongoose';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { FullConnection } from '../../models/item-data/full/full-connection.model';
import { IConnectionType, connectionTypeModel } from '../../models/mongoose/connection-type.model';
import { ObjectId } from 'mongodb';
import { FullConfigurationItem } from '../../models/item-data/full/full-configuration-item.model';

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

export async function configurationItemModelDelete(id: string, authentication: IUser) {
    let itemToDelete: IConfigurationItem = await configurationItemModel.findById(id)
        .populate({ path: responsibleUsersField, select: nameField });
    if (!itemToDelete) {
        throw notFoundError;
    }
    checkResponsibility(authentication, itemToDelete);
    const deletedConnections: IConnection[] = await connectionModel
        .find({ $or: [{ upperItem: itemToDelete._id }, { lowerItem: itemToDelete._id }] })
        .populate(connectionRuleField).populate(`${connectionRuleField}.${connectionTypeField}`);
    const connections = (await Promise.all(deletedConnections.map(c => logAndRemoveConnection(c)))).map(c => new Connection(c));
    const historicItem = getHistoricItem(itemToDelete);
    updateItemHistory(itemToDelete._id, historicItem, true);
    itemToDelete = await itemToDelete.remove();
    const item = new ConfigurationItem(itemToDelete);
    return { item, connections };
}

export async function modelAvailableItemsForConnectionRuleAndCount(connectionRule: string, itemsCountToConnect: number) {
    let connections: Connection[];
    let cr: ConnectionRule;
    [connections, cr] = await Promise.all([
        connectionModelFind({connectionRule}),
        connectionRuleModelFindSingle(connectionRule)
    ]);
    if (!cr) { throw notFoundError; }
    if (itemsCountToConnect > cr.maxConnectionsToUpper) {
        return [];
    }
    const query: MongooseFilterQuery<Pick<IConfigurationItem, '_id' | 'type'>> = {};
    if (connections.length > 0) {
        let existingItemIds: string[] = [...new Set(connections.map(c => c.lowerItemId))];
        existingItemIds = existingItemIds.filter(id =>
            cr.maxConnectionsToUpper - connections.filter(c => c.lowerItemId === id).length < itemsCountToConnect
        );
        if (existingItemIds.length > 0) {
            query._id = {$not: {$in: existingItemIds}};
        }
    }
    query.type = cr.lowerItemTypeId;
    return await configurationItemModelFind(query);
}

export function modelFindAndReturnConnectionsToLower(upperItem: string) {
    return connectionModel.find({upperItem}).populate({path: connectionRuleField}).populate({path: lowerItemField})
        .then(async (connections: IConnectionPopulated[]) => {
            const itemTypes: IItemType[] = await itemTypeModel.find({_id: {$in: connections.map(c => c.lowerItem.type)}});
            const connectionTypes: IConnectionType[] = await connectionTypeModel.find({_id: {$in: connections.map(c => c.connectionRule.connectionType)}});
            const fullConnections: FullConnection[] = [];
            connections.forEach(c => {
                const connection = new FullConnection(c);
                const itemType = itemTypes.find(it => it.id === c.lowerItem.type.toString()) as IItemType;
                const connectionType = connectionTypes.find(ct => ct.id === c.connectionRule.connectionType.toString()) as IConnectionType;
                connection.targetId = c.lowerItem.id!;
                connection.targetName = c.lowerItem.name;
                connection.targetTypeId = itemType.id;
                connection.targetType = itemType.name;
                connection.targetColor = itemType.color;
                connection.type = connectionType.name;
                fullConnections.push(connection);
            });
            return fullConnections;
        });
}

export function modelFindAndReturnConnectionsToUpper(lowerItem: string) {
    return connectionModel.find({lowerItem})
        .populate({path: connectionRuleField})
        .populate({path: upperItemField})
        .then(async (connections: IConnectionPopulated[]) => {
            const itemTypes: IItemType[] = await itemTypeModel.find({_id: {$in: connections.map(c => c.upperItem.type)}});
            const connectionTypes: IConnectionType[] = await connectionTypeModel.find({_id: {$in: connections.map(c => c.connectionRule.connectionType)}});
            const fullConnections: FullConnection[] = [];
            connections.forEach(c => {
                const connection = new FullConnection(c);
                const itemType = itemTypes.find(it => it.id === c.upperItem.type.toString()) as IItemType;
                const connectionType = connectionTypes.find(ct => ct.id === c.connectionRule.connectionType.toString())!;
                connection.targetId = c.upperItem.id!;
                connection.targetName = c.upperItem.name;
                connection.targetTypeId = itemType.id;
                connection.targetType = itemType.name;
                connection.targetColor = itemType.color;
                connection.type = connectionType.reverseName;
                fullConnections.push(connection);
            });
            return fullConnections;
        });
}


// This alternative is not faster than my implementation, even though it save one database roundtrip.
// So I simply commented it out, as a pattern maybe for future use
// export async function modelGetItemsForLowerItemTypeInConnectionRule(connectionRuleId: string) {
//     const connectionRuleArray = await connectionRuleModel.aggregate([
//         {
//           $match: {
//             _id: new ObjectId(connectionRuleId)
//           }
//         }, {
//           $lookup: {
//             from: 'configurationitems',
//             localField: 'lowerItemType',
//             foreignField: 'type',
//             as: 'items'
//           }
//         }
//     ]);
//     if (!connectionRuleArray || connectionRuleArray.length !== 1) {
//         throw notFoundError;
//     }
//     const items = (connectionRuleArray[0].items as IConfigurationItem[]).map(i => new ConfigurationItem(i));
//     const connectionRule = new ConnectionRule(connectionRuleArray[0]);
//     return { items, connectionRule };
// }

export async function modelGetAllowedUpperConfigurationItemsForRule(connectionRuleId: string, itemId?: string) {
    const connectionRule: IConnectionRule = await connectionRuleModel.findById(connectionRuleId);
    if (!connectionRule) {
      throw notFoundError;
    }
    let items = await configurationItemModelFind({ type: connectionRule.upperItemType });
    // This alternative is not faster than my implementation, even though it save one database roundtrip, so I simply commented it out
    // const { items, connectionRule } = await modelGetItemsForLowerItemTypeInConnectionRule(connectionRuleId);
    if (itemId) {
        // if itemId is set, then filter out all items that are connected to this item
        const forbiddenConnections = await connectionModelFind({ connectionRule: connectionRuleId, lowerItem: itemId });
        const forbiddenItemIds = forbiddenConnections.map(c => c.upperItemId);
        items = items.filter(i => !forbiddenItemIds.includes(i.id));
    }
    const existingItemIds: ObjectId[] = items.map(i => new ObjectId(i.id));
    const count = new Map<string, number>();
    ((await connectionModel.aggregate([{
        $match: { upperItem: { $in: existingItemIds }, connectionRule: new ObjectId(connectionRuleId) },
    }, {
        $group: {
            _id: '$upperItem',
            count: {$sum: 1}}
    }]).exec()) as {_id: ObjectId, count: number}[]).forEach(c => count.set(c._id.toString(), c.count));
    return items.filter(item => !count.has(item.id) || count.get(item.id)! < connectionRule.maxConnectionsToLower);
  }

export async function modelGetAllowedLowerConfigurationItemsForRule(connectionRuleId: string, itemId?: string) {
    const connectionRule: IConnectionRule = await connectionRuleModel.findById(connectionRuleId);
    if (!connectionRule) {
        throw notFoundError;
    }
    let items = await configurationItemModelFind({type: connectionRule.lowerItemType});
    if (itemId) {
        // if itemId is set, then filter out all items that are connected to this item
        const forbiddenConnections = await connectionModelFind({ connectionRule: connectionRuleId, upperItem: itemId });
        const forbiddenItemIds = forbiddenConnections.map(c => c.lowerItemId);
        items = items.filter(i => !forbiddenItemIds.includes(i.id));
    }
    const existingItemIds: ObjectId[] = items.map(i => new ObjectId(i.id));
    const count = new Map<string, number>();
    ((await connectionModel.aggregate([{
        $match: { lowerItem: { $in: existingItemIds }, connectionRule: new ObjectId(connectionRuleId) },
    }, {
        $group: {
            _id: '$lowerItem',
            count: {$sum: 1}}
    }]).exec()) as {_id: ObjectId, count: number}[]).forEach(c => count.set(c._id.toString(), c.count));
    return items.filter(item => !count.has(item.id) || count.get(item.id)! < connectionRule.maxConnectionsToUpper);
}

export async function modelGetFullConfigurationItemsByIds(itemIds: string[]) {
    let items: IConfigurationItemPopulated[];
    let connectionsToUpper: IConnection[];
    let connectionsToLower: IConnection[];
    let connectionRules: IConnectionRulePopulated[];
    [items, connectionsToUpper, connectionsToLower, connectionRules] = await Promise.all([
        configurationItemModel.find({_id: {$in: itemIds}}).sort(nameField)
            .populate({ path: typeField })
            .populate({ path: `${attributesField}.${typeField}`, select: nameField })
            .populate({ path: responsibleUsersField, select: nameField }),
        connectionModel.find({lowerItem: {$in: itemIds}}),
        connectionModel.find({upperItem: {$in: itemIds}}),
        connectionRuleModel.find().populate({path: connectionTypeField, select: nameField}),
    ]);
    // make unique ids for all needed target items
    const targetIds: string[] = [...new Set([
        ...connectionsToUpper.map(c => c.upperItem.toString()),
        ...connectionsToLower.map(c => c.lowerItem.toString())])
    ];
    // retrieve needed target items
    const targetItems: IConfigurationItemPopulated[] = await configurationItemModel
        .find({_id: {$in: targetIds}}).populate({ path: typeField });
    const fullItems = items.map(item => {
        // build connections to upper
        const ctu = connectionsToUpper.map(c => createFullConnection(c,
            connectionRules.find(r => r._id.toString() === c.connectionRule.toString())!,
            targetItems.find(i => i._id.toString() === c.upperItem.toString())!
        ));
        // build connections to lower
        const ctl = connectionsToLower.map(c => createFullConnection(c,
            connectionRules.find(r => r._id.toString() === c.connectionRule.toString())!,
            targetItems.find(i => i._id.toString() === c.lowerItem.toString())!
        ));
        return new FullConfigurationItem(item, ctu, ctl);
    });
    return fullItems;
}


function createFullConnection(connection: IConnection, rule: IConnectionRulePopulated, targetItem: IConfigurationItemPopulated) {
    const conn = new FullConnection(connection);
    conn.ruleId = rule.id;
    conn.typeId = rule.connectionType.id!;
    conn.type = rule.connectionType.name;
    conn.targetId = targetItem.id!;
    conn.targetName = targetItem.name;
    conn.targetTypeId = targetItem.type.id;
    conn.targetType = targetItem.type.name;
    conn.targetColor = targetItem.type.color;
    return conn;
}
