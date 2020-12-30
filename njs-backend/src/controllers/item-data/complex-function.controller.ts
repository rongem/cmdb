import { Request, Response, NextFunction } from 'express';

import { configurationItemModel, IAttribute, IConfigurationItem, IConfigurationItemPopulated } from '../../models/mongoose/configuration-item.model';
import { itemTypeModel, IItemType } from '../../models/mongoose/item-type.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { serverError, notFoundError } from '../error.controller';
import socket from '../socket.controller';
import {
    idField,
    newItemTypeNameField,
    colorField,
    positionField,
    connectionTypeField,
    connectionsToUpperField,
    ruleIdField,
    targetIdField,
    descriptionField,
    connectionsToLowerField
} from '../../util/fields.constants';
import {
    attributeTypeCat,
    createCtx,
    deleteCtx,
    connectionCat,
    configurationItemCat,
    itemTypeCat,
    connectionRuleCat,
    updateCtx,
} from '../../util/socket.constants';
import { connectionRuleModel, IConnectionRulePopulated, IConnectionRule } from '../../models/mongoose/connection-rule.model';
import { IUser } from '../../models/mongoose/user.model';
import { connectionModel } from '../../models/mongoose/connection.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { Connection } from '../../models/item-data/connection.model';
import { FullConnection } from '../../models/item-data/full/full-connection.model';
import { ProtoConnection } from '../../models/item-data/full/proto-connection.model';
import { buildHistoricConnection } from './connection.controller';
import { historicConnectionModel } from '../../models/mongoose/historic-connection.model';
import { FullConfigurationItem } from '../../models/item-data/full/full-configuration-item.model';
import { ItemType } from '../../models/meta-data/item-type.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';

export async function createFullItem(req: Request, item: IConfigurationItemPopulated) {
    const connectionsToUpper: FullConnection[] = [];
    const connectionsToLower: FullConnection[] = [];
    const historicConnectionsToCreate: any[] = [];
    if (req.body[connectionsToUpperField]) {
      const values = req.body[connectionsToUpperField] as ProtoConnection[];
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < values.length; index++) {
        const value = values[index];
        const rule = req.connectionRules.find(r => r.id === value[ruleIdField]) as IConnectionRulePopulated;
        const connection = await connectionModel.create({
          connectionRule: value[ruleIdField],
          upperItem: value[targetIdField],
          lowerItem: item.id,
          description: value[descriptionField] ?? '',
        });
        const targetItem = req.configurationItems.find(i => i.id === value[targetIdField]) as IConfigurationItem;
        const conn = new FullConnection(connection);
        conn.ruleId = rule.id!;
        conn.typeId = rule.connectionType.id!;
        conn.type = rule.connectionType.reverseName;
        conn.targetId = value[targetIdField];
        conn.targetName = targetItem.name;
        conn.targetTypeId = targetItem.type.id;
        conn.targetType = targetItem.type.name;
        conn.targetColor = targetItem.type.color;
        connectionsToUpper.push(conn);
        socket.emit(connectionCat, createCtx, new Connection(connection));
        historicConnectionsToCreate.push(await buildHistoricConnection(connection, [rule.connectionType]));
      }
    }
    if (req.body[connectionsToLowerField]) {
      const values = req.body[connectionsToLowerField] as ProtoConnection[];
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < values.length; index++) {
        const value = values[index];
        const rule = req.connectionRules.find(r => r.id === value[ruleIdField]) as IConnectionRule;
        const connection = await connectionModel.create({
          connectionRule: value[ruleIdField],
          upperItem: item.id,
          lowerItem: value[targetIdField],
          description: value[descriptionField] ?? '',
        });
        const targetItem = req.configurationItems.find(i => i.id === value[targetIdField]) as IConfigurationItem;
        const conn = new FullConnection(connection);
        conn.ruleId = rule.id!;
        conn.typeId = rule.connectionType.id!;
        conn.type = rule.connectionType.name;
        conn.targetId = value[targetIdField];
        conn.targetName = targetItem.name;
        conn.targetTypeId = targetItem.type.id;
        conn.targetType = targetItem.type.name;
        conn.targetColor = targetItem.type.color;
        connectionsToLower.push(conn);
        socket.emit(connectionCat, createCtx, new Connection(connection));
        historicConnectionsToCreate.push(await buildHistoricConnection(connection, [rule.connectionType]));
      }
    }
    await historicConnectionModel.insertMany(historicConnectionsToCreate);
    return new FullConfigurationItem(item, connectionsToUpper, connectionsToLower);
  }

export async function convertAttributeTypeToItemType(req: Request, res: Response, next: NextFunction) {
    try {
        const allowedItemTypes = await itemTypeModel.find({ attributeGroups: req.attributeType.attributeGroup });
        const newItemType = await getOrCreateItemType(req.body[newItemTypeNameField],
            req.body[colorField], [...new Set(req.attributeTypes.map(a => a.attributeGroup))]);
        const newItemIsUpperType = req.body[positionField] === 'above';
        const changedItems = [];
        const changedConnections = [];
        const attributeItemMap = new Map<string, IConfigurationItem>();
        // tslint:disable: prefer-for-of
        for (let index = 0; index < allowedItemTypes.length; index++) {
            const targetItemType = allowedItemTypes[index];
            const upperType = newItemIsUpperType ? newItemType : targetItemType;
            const lowerType = newItemIsUpperType ? targetItemType : newItemType;
            const connectionRule = await getOrCreateConnectionRule(upperType, lowerType, req.body[connectionTypeField]);
            const items: IConfigurationItem[] = await configurationItemModel.find({type: targetItemType._id, 'attributes.type': req.attributeType._id});
            const attributeValues = getUniqueAttributeValues(items, req.attributeType._id.toString());
            // go through all unique attribute values and create items from them
            for (let j = 0; j < attributeValues.length; j++) {
                let targetItem: IConfigurationItem;
                const sourceItems = items.filter(i => i.attributes.some(a => a.type.toString() === req.body[idField] &&
                    a.value.toLocaleLowerCase() === attributeValues[j].toLocaleLowerCase()));
                const accompanyingAttributes = sourceItems[0].attributes.filter(a => req.attributeTypes.map(t => t.id).includes(a.type.toString()));
                // check if item exists (maybe from a former run) or create it
                if (attributeItemMap.has(attributeValues[j].toLocaleLowerCase())) {
                    targetItem = attributeItemMap.get(attributeValues[j].toLocaleLowerCase()) as IConfigurationItem;
                } else {
                    targetItem = await getOrCreateConfigurationItem(attributeValues[j], targetItemType.id!, accompanyingAttributes, req.authentication);
                    attributeItemMap.set(attributeValues[j].toLocaleLowerCase(), targetItem);
                }
                changedItems.push(new ConfigurationItem(targetItem));
                // create connections for all the items with the attribute of that value
                for (let k = 0; k < sourceItems.length; k++) {
                    const sourceItem = sourceItems[k];
                    let newConnection;
                    if (newItemIsUpperType) {
                        newConnection = await getOrCreateConnection(targetItem.id!, sourceItem.id!, connectionRule.id!, '');
                    } else {
                        newConnection = await getOrCreateConnection(sourceItem.id!, targetItem.id!, connectionRule.id!, '');
                    }
                    // after creation, delete attribute and all accompanying attributes in the items
                    if (newConnection) {
                        changedConnections.push(new Connection(newConnection));
                        sourceItem.attributes = sourceItem.attributes.filter(a => a.type.toString() !== req.attributeType.id &&
                            !accompanyingAttributes.map(aa => aa.type.toString()).includes(a.type.toString()));
                        const changedItem = new ConfigurationItem(await sourceItem.save());
                        changedItems.push(changedItem);
                        socket.emit(configurationItemCat, updateCtx, changedItem);
                    }
                }
            }
        }
        // after finishing creation of items, check if attributes of that type still exist. If not, delete the attribute type
        const itemsWithAttributeType = await configurationItemModel.find({'attributes.type': req.attributeType._id});
        if (itemsWithAttributeType.length > 0) {
            throw new Error('Did not remove all attributes, something went wrong.');
        }
        const deletedAttributeType = new AttributeType(await req.attributeType.remove());
        socket.emit(attributeTypeCat, deleteCtx, deletedAttributeType);
        res.status(201).json({
            itemType: newItemType,
            items: changedItems,
            connections: changedConnections,
            deletedAttributeType,
        });
    } catch (error) {
        serverError(next, error);
    }
}

function getUniqueAttributeValues(items: IConfigurationItem[], attributeTypeId: string) {
    const attributeValues = [...new Set(items.map(i => (i.attributes.find(a => a.type.toString() === attributeTypeId) as IAttribute).value))];
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

async function getOrCreateConnection(upperItem: string, lowerItem: string, connectionRule: string, description: string) {
    let connection = await connectionModel.findOne({upperItem, lowerItem, connectionRule});
    if (!connection) {
        connection = await connectionModel.create({ upperItem, lowerItem, connectionRule, description });
        // tbd: create historic connection
        socket.emit(connectionCat, createCtx, new Connection(connection));
    }
    return connection;
}

async function getOrCreateConfigurationItem(name: string, type: string, attributes: IAttribute[], creator: IUser) {
    let item = await configurationItemModel.findOne({name, type});
    if (!item) {
        item = await configurationItemModel.create({
            attributes: attributes.map(a => ({...a, _id: undefined})),
            links: [],
            responsibleUsers: [creator],
            name,
            type,
        });
        // tbd: create Historic item
        socket.emit(configurationItemCat, createCtx, new ConfigurationItem(item));
    }
    return item;
}

async function getOrCreateItemType(name: string, color: string, attributeGroups: {id: string}[]) {
    let newItemType = await itemTypeModel.findOne({ name });
    if (!newItemType) {
        newItemType = await itemTypeModel.create({
            name,
            color,
            attributeGroups,
        });
        socket.emit(itemTypeCat, createCtx, new ItemType(newItemType));
    }
    return newItemType;
}

async function getOrCreateConnectionRule(upperType: IItemType, lowerType: IItemType, connectionTypeId: string) {
    let connectionRule = await connectionRuleModel.findByContent(upperType._id, lowerType._id, connectionTypeId);
    if (!connectionRule) {
        connectionRule = await connectionRuleModel.create({
            connectionType: connectionTypeId,
            lowerItemType: lowerType._id,
            upperItemType: upperType._id,
            maxConnectionsToLower: 9999,
            maxConnectionsToUpper: 9999,
            validationExpression: '^.*$',
        });
        socket.emit(connectionRuleCat, createCtx, new ConnectionRule(connectionRule));
    }
    return connectionRule;
}
