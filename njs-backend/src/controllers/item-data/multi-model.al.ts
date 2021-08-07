import { IAttributeType } from '../../models/mongoose/attribute-type.model';
import { IItemType, itemTypeModel } from '../../models/mongoose/item-type.model';
import { IUser } from '../../models/mongoose/user.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { Connection } from '../../models/item-data/connection.model';
import { connectionRuleModel, IConnectionRulePopulated } from '../../models/mongoose/connection-rule.model';
import { notFoundError } from '../../controllers/error.controller';
import { IConfigurationItem, configurationItemModel, IConfigurationItemPopulated } from '../../models/mongoose/configuration-item.model';
import { connectionModel, IConnection } from '../../models/mongoose/connection.model';
import {
    connectionModelCreate,
    connectionModelFind,
    connectionModelFindOne,
    logAndRemoveConnection,
    connectionsFindByUpperItemPopulated,
    connectionFindByLowerItemPopulated,
    connectionsFindByUpperItems,
    connectionsFindByLowerItems,
} from './connection.al';
import { connectionRuleModelCreate, connectionRuleModelFindByContent, connectionRuleModelFindSingle } from '../meta-data/connection-rule.al';
import { itemTypeModelCreate, itemTypeModelFind, itemTypeModelFindAll, itemTypeModelFindOne } from '../meta-data/item-type.al';
import {
    configurationItemFindByIdPopulated,
    configurationItemModelCreate,
    configurationItemModelFind,
    configurationItemModelFindOne,
    configurationItemModelTakeResponsibility,
    configurationItemModelUpdate,
    configurationItemsFindPopulated,
} from './configuration-item.al';
import {
    buildHistoricItemVersion,
    updateItemHistory
} from './historic-item.al';
import { ItemAttribute } from '../../models/item-data/item-attribute.model';
import { HttpError } from '../../rest-api/httpError.model';
import { attributeTypeModelDelete, attributeTypeModelFindAll } from '../meta-data/attribute-type.al';
import { checkResponsibility } from '../../routes/validators';
import { FilterQuery } from 'mongoose';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { FullConnection } from '../../models/item-data/full/full-connection.model';
import { IConnectionType, connectionTypeModel } from '../../models/mongoose/connection-type.model';
import { ObjectId } from 'mongodb';
import { FullConfigurationItem } from '../../models/item-data/full/full-configuration-item.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { ItemType } from '../../models/meta-data/item-type.model';
import { conversionIncompleteMsg } from '../../util/messages.constants';
import { connectionTypeModelFindAll } from '../meta-data/connection-type.al';
import { attributeGroupModelFind } from '../meta-data/attribute-group.al';

export async function modelConvertAttributeTypeToItemType(id: string, newItemTypeName: string,
                                                          attributeType: IAttributeType, attributeTypes: IAttributeType[],
                                                          connectionTypeId: string, color: string, newItemIsUpperType: boolean,
                                                          authentication: IUser) {
    const attributeGroupId = attributeType.attributeGroup._id;
    const attributeTypeIds = attributeTypes.map(t => t.id);
    const [attributeGroups, allAttributeTypes] = await Promise.all([
        attributeGroupModelFind({_id: {$in: [...new Set(attributeTypes.map(a => a.attributeGroup))]}}),
        attributeTypeModelFindAll(),
    ]);
    let allowedItemTypes;
    let newItemType;
    [allowedItemTypes, newItemType] = await Promise.all([
        itemTypeModelFind({ attributeGroups: attributeGroupId }),
        getOrCreateItemType(newItemTypeName, color, attributeGroups),
    ]);
    const changedItems = [];
    const changedConnections = [];
    const attributeItemMap = new Map<string, ConfigurationItem>();
    for (let index = 0; index < allowedItemTypes.length; index++) {
        const targetItemType = allowedItemTypes[index];
        const upperType = newItemIsUpperType ? newItemType : targetItemType;
        const lowerType = newItemIsUpperType ? targetItemType : newItemType;
        let connectionRule: ConnectionRule;
        let items: ConfigurationItem[];
        [connectionRule, items] = await Promise.all([
            getOrCreateConnectionRule(upperType, lowerType, connectionTypeId),
            configurationItemModelFind({type: targetItemType.id, 'attributes.type': attributeType._id}),
        ]);
        const attributeValues = getUniqueAttributeValues(items, attributeType._id.toString());
        // go through all unique attribute values and create items from them
        for (let j = 0; j < attributeValues.length; j++) {
            let targetItem: ConfigurationItem;
            const sourceItems = items.filter(i => i.attributes.some(a => a.typeId === id &&
                a.value.toLocaleLowerCase() === attributeValues[j].toLocaleLowerCase()));
            const accompanyingAttributes = sourceItems[0].attributes.filter(a => attributeTypeIds.includes(a.typeId));
            // check if item exists (maybe from a former run) or create it
            if (attributeItemMap.has(attributeValues[j].toLocaleLowerCase())) {
                targetItem = attributeItemMap.get(attributeValues[j].toLocaleLowerCase())!;
            } else {
                targetItem = await getOrCreateConfigurationItem(attributeValues[j], targetItemType.id!, accompanyingAttributes,
                    targetItemType, allAttributeTypes, authentication);
                attributeItemMap.set(attributeValues[j].toLocaleLowerCase(), targetItem);
            }
            changedItems.push(targetItem);
            // create connections for all the items with the attribute of that value
            for (let k = 0; k < sourceItems.length; k++) {
                let sourceItem = sourceItems[k];
                let newConnection: Connection;
                if (newItemIsUpperType) {
                    targetItem = await ensureResponsibility(authentication, targetItem);
                    newConnection = await getOrCreateConnection(targetItem.id!, sourceItem.id!, connectionRule.id!, '', authentication);
                } else {
                    sourceItem = await ensureResponsibility(authentication, sourceItem);
                    newConnection = await getOrCreateConnection(sourceItem.id!, targetItem.id!, connectionRule.id!, '', authentication);
                }
                // after creation, delete attribute and all accompanying attributes in the items
                if (newConnection) {
                    changedConnections.push(newConnection);
                    const accompanyingAttributeTypeIds = accompanyingAttributes.map(a => a.typeId);
                    sourceItem.attributes = sourceItem.attributes.filter(a => a.typeId !== attributeType.id &&
                        !accompanyingAttributeTypeIds.includes(a.typeId));
                    const changedItem = await configurationItemModelUpdate(authentication, sourceItem.id, sourceItem.name, sourceItem.typeId,
                        sourceItem.responsibleUsers, sourceItem.attributes, sourceItem.links, allAttributeTypes);
                    changedItems.push(changedItem);
                }
            }
        }
    }
    // after finishing creation of items, check if attributes of that type still exist. If not, delete the attribute type
    const itemsWithAttributeType = await configurationItemModelFind({'attributes.type': attributeType._id});
    if (itemsWithAttributeType.length > 0) {
        throw new HttpError(500, conversionIncompleteMsg, itemsWithAttributeType);
    }
    const deletedAttributeType = await attributeTypeModelDelete(attributeType.id);
    return {
        itemType: newItemType,
        items: changedItems,
        connections: changedConnections,
        deletedAttributeType,
    };
}

async function ensureResponsibility(user: IUser, item: ConfigurationItem) {
    if (!item.responsibleUsers.includes(user.name)) {
        item = await configurationItemModelTakeResponsibility(item.id, user);
    }
    return item;
}

// get the first case combination of all identical values (not simply the lower case)
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

async function getOrCreateConfigurationItem(name: string, type: string, attributes: ItemAttribute[], itemType: ItemType,
                                            attributeTypes: AttributeType[], creator: IUser) {
    let item: ConfigurationItem;
    try {
        item = await configurationItemModelFindOne(name, type);
    } catch (error) {
        item = await configurationItemModelCreate([creator.name], creator.id!, creator, name, type,
            attributes, [], itemType, attributeTypes);
    }
    return item;
}

async function getOrCreateItemType(name: string, color: string, attributeGroups: {['id']: string}[]) {
    let newItemType = await itemTypeModelFindOne(name);
    if (!newItemType) {
        newItemType = await itemTypeModelCreate(name, color, attributeGroups.map(ag => ag.id));
    }
    return newItemType;
}

async function getOrCreateConnectionRule(upperType: ItemType, lowerType: ItemType, connectionTypeId: string) {
    let connectionRule;
    try {
        connectionRule = await connectionRuleModelFindByContent(upperType.id, lowerType.id, connectionTypeId);
    } catch (error) {
        connectionRule = await connectionRuleModelCreate(connectionTypeId, lowerType.id, upperType.id, '^.*$', 9999, 9999);
    }
    return connectionRule;
}

interface ExtendedAttribute extends ItemAttribute {
    itemId: string;
}

export async function modelGetCorrespondingValuesOfType(attributeType: string) {
    // const distinctValues = (await getDistinctAttributeValues(attributeType)).map((value: {_id: string, count: number}) => value._id);
    let items: ConfigurationItem[];
    let attributeTypes: AttributeType[];
    [items, attributeTypes] = await Promise.all([
        configurationItemModelFind({'attributes.type': new ObjectId(attributeType)}),
        attributeTypeModelFindAll(),
    ]);
    const attributesOfType: ExtendedAttribute[] = [];
    const otherAttributes: ExtendedAttribute[] = [];
    items.forEach(i => i.attributes.forEach(a => {
        if (a.typeId === attributeType) {
            attributesOfType.push({...a, value: a.value.toLocaleLowerCase(), itemId: i.id});
        } else {
            otherAttributes.push({...a, value: a.value.toLocaleLowerCase(), itemId: i.id});
        }
    }));
    const distinctValues = [...new Set(attributesOfType.map(a => a.value))];
    const nonUniqueAttributeTypes: string[] = [];
    distinctValues.forEach(value => {
        const matchingItemIds = attributesOfType.filter(a => a.value === value).map(a => a.itemId);
        const accompanyingAttributes = otherAttributes.filter(a => matchingItemIds.includes(a.itemId));
        const attributeTypeIds = [...new Set(accompanyingAttributes.map(a => a.typeId))];
        attributeTypeIds.forEach(typeId => {
            const valuesCount = [...new Set(accompanyingAttributes.filter(a => a.typeId === typeId).map(a => a.value))].length;
            if (valuesCount > 1) {
                nonUniqueAttributeTypes.push(typeId);
            }
        });
    });
    const resultAttributeTypeIds = [...new Set(otherAttributes.map(a => a.typeId))].filter(a => !nonUniqueAttributeTypes.includes(a));
    return resultAttributeTypeIds.length > 0 ? attributeTypes.filter(a => resultAttributeTypeIds.includes(a.id)) : [];
}

// getting distinct attribute values from mongodb. quick, but not all that I need so overall it would be slower
// function getDistinctAttributeValues(attributeType: string) {
//     return configurationItemModel.aggregate([{
//           $unwind: { path: '$attributes', preserveNullAndEmptyArrays: false }
//         }, {
//           $match: { 'attributes.type': new ObjectId(attributeType) }
//         }, {
//           $replaceRoot: { newRoot: '$attributes' }
//         }, {
//           $project: { value: { $toLower: '$value' } }
//         }, {
//           $group: { _id: '$value', count: { $sum: 1 } }
//         }
//     ]).exec();
// }

export async function configurationItemModelDelete(id: string, authentication: IUser) {
    let itemToDelete = await configurationItemFindByIdPopulated(id);
    if (!itemToDelete) {
        throw notFoundError;
    }
    checkResponsibility(authentication, itemToDelete);
    const deletedConnections: IConnection[] = await connectionModel
        .find({ $or: [{ upperItem: itemToDelete._id }, { lowerItem: itemToDelete._id }] })
        .populate('connectionRule').populate(`${'connectionRule'}.${'connectionType'}`);
    const connections = (await Promise.all(deletedConnections.map(c => logAndRemoveConnection(c)))).map(c => new Connection(c));
    const historicItem = buildHistoricItemVersion(itemToDelete, authentication.name);
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
    const query: FilterQuery<IConfigurationItem> = {};
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

export async function modelFindAndReturnConnectionsToLower(upperItem: string) {
    const connections = await connectionsFindByUpperItemPopulated(upperItem);
    const [itemTypes, connectionTypes] = await Promise.all([
        itemTypeModel.find({ _id: { $in: connections.map(c => c.lowerItem.type) } }),
        connectionTypeModel.find({ _id: { $in: connections.map(c => c.connectionRule.connectionType) } })
    ]);
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
}

export async function modelFindAndReturnConnectionsToUpper(lowerItem: string) {
    const connections = await connectionFindByLowerItemPopulated(lowerItem);
    const [itemTypes, connectionTypes] = await Promise.all([
        itemTypeModel.find({ _id: { $in: connections.map(c => c.upperItem.type) } }),
        connectionTypeModel.find({ _id: { $in: connections.map(c => c.connectionRule.connectionType) } })
    ]);
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
}


// This alternative is not faster than my implementation, even though it saved one database roundtrip.
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
//             'local': 'lowerItemType',
//             'foreign': 'type',
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
    const connectionRule = await connectionRuleModel.findById(connectionRuleId);
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
    const connectionRule = await connectionRuleModel.findById(connectionRuleId);
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
        configurationItemsFindPopulated({_id: {$in: itemIds}}),
        connectionsFindByLowerItems(itemIds),
        connectionsFindByUpperItems(itemIds),
        connectionRuleModel.find().populate({path: 'connectionType', select: 'name'}),
    ]);
    // make unique ids for all needed target items
    const targetIds: string[] = [...new Set([
        ...connectionsToUpper.map(c => c.upperItem.toString()),
        ...connectionsToLower.map(c => c.lowerItem.toString())])
    ];
    // retrieve needed target items
    const targetItems: IConfigurationItemPopulated[] = await configurationItemModel
        .find({_id: {$in: targetIds}});
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

export async function modelGetFullConfigurationItemsByTypeIds(typeIds: string[]) {
    const items: FullConfigurationItem[] = await configurationItemModelFind({ type: { $in: typeIds}});
    const itemIds = items.map(i => i.id);
    const [itemTypes, connectionTypes, connectionsToLower, connectionsToUpper] = await Promise.all([
        itemTypeModelFindAll(),
        connectionTypeModelFindAll(),
        connectionModel.find({upperItem: {$in: itemIds}}).populate('lowerItem').populate('connectionRule'),
        connectionModel.find({lowerItem: {$in: itemIds}}).populate('upperItem').populate('connectionRule'),
    ]);
    items.forEach(i => {
        i.connectionsToLower = connectionsToLower.filter(c => c.upperItem.toString() === i.id).map(c => {
            const connection = new FullConnection(c);
            const itemType = itemTypes.find(it => it.id === c.lowerItem.type.toString())!;
            const connectionType = connectionTypes.find(ct => ct.id === c.connectionRule.connectionType.toString())!;
            connection.targetId = c.lowerItem.id!;
            connection.targetName = c.lowerItem.name;
            connection.targetTypeId = itemType.id;
            connection.targetType = itemType.name;
            connection.targetColor = itemType.backColor;
            connection.type = connectionType.name;
            return connection;
        });
        i.connectionsToUpper = connectionsToUpper.filter(c => c.lowerItem.toString() === i.id).map(c => {
            const connection = new FullConnection(c);
            const itemType = itemTypes.find(it => it.id === c.upperItem.type.toString())!;
            const connectionType = connectionTypes.find(ct => ct.id === c.connectionRule.connectionType.toString())!;
            connection.targetId = c.upperItem.id!;
            connection.targetName = c.upperItem.name;
            connection.targetTypeId = itemType.id;
            connection.targetType = itemType.name;
            connection.targetColor = itemType.backColor;
            connection.type = connectionType.name;
            return connection;
        });
    })
    return items;
}


function createFullConnection(connection: IConnection, rule: IConnectionRulePopulated, targetItem: IConfigurationItemPopulated) {
    const conn = new FullConnection(connection);
    conn.ruleId = rule.id;
    conn.typeId = rule.connectionType.id!;
    conn.type = rule.connectionType.name;
    conn.targetId = targetItem.id!;
    conn.targetName = targetItem.name;
    conn.targetTypeId = targetItem.type.toString();
    conn.targetType = targetItem.typeName;
    conn.targetColor = targetItem.typeColor;
    return conn;
}
