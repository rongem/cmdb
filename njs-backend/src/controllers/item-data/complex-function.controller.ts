import { Request, Response, NextFunction } from 'express';

import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { itemTypeModel, IItemType } from '../../models/mongoose/item-type.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { serverError } from '../error.controller';
import socket from '../socket.controller';
import {
    idField,
    newItemTypeNameField,
    colorField,
    positionField,
    connectionTypeField,
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
import { IUser } from '../../models/mongoose/user.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { Connection } from '../../models/item-data/connection.model';
import { connectionModelCreate, connectionModelFindOne } from './connection.al';
import { connectionRuleModelCreate, connectionRuleModelFindByContent } from '../meta-data/connection-rule.al';
import { itemTypeModelCreate, itemTypeModelFindOne } from '../meta-data/item-type.al';
import { configurationItemModelCreate, configurationItemModelFind, configurationItemModelFindOne, configurationItemModelUpdate } from './configuration-item.al';
import { ItemAttribute } from '../../models/item-data/item-attribute.model';

export async function convertAttributeTypeToItemType(req: Request, res: Response, next: NextFunction) {
    try {
        const allowedItemTypes = await itemTypeModel.find({ attributeGroups: req.attributeType.attributeGroup });
        const newItemType = await getOrCreateItemType(req.body[newItemTypeNameField],
            req.body[colorField], [...new Set(req.attributeTypes.map(a => a.attributeGroup))]);
        const newItemIsUpperType = req.body[positionField] === 'above';
        const changedItems = [];
        const changedConnections = [];
        const attributeItemMap = new Map<string, ConfigurationItem>();
        // tslint:disable: prefer-for-of
        for (let index = 0; index < allowedItemTypes.length; index++) {
            const targetItemType = allowedItemTypes[index];
            const upperType = newItemIsUpperType ? newItemType : targetItemType;
            const lowerType = newItemIsUpperType ? targetItemType : newItemType;
            const connectionRule = await getOrCreateConnectionRule(upperType, lowerType, req.body[connectionTypeField]);
            const items: ConfigurationItem[] = await configurationItemModelFind({type: targetItemType._id, 'attributes.type': req.attributeType._id});
            const attributeValues = getUniqueAttributeValues(items, req.attributeType._id.toString());
            // go through all unique attribute values and create items from them
            for (let j = 0; j < attributeValues.length; j++) {
                let targetItem: ConfigurationItem;
                const sourceItems = items.filter(i => i.attributes.some(a => a.typeId === req.body[idField] &&
                    a.value.toLocaleLowerCase() === attributeValues[j].toLocaleLowerCase()));
                const accompanyingAttributes = sourceItems[0].attributes.filter(a => req.attributeTypes.map(t => t.id).includes(a.typeId));
                // check if item exists (maybe from a former run) or create it
                if (attributeItemMap.has(attributeValues[j].toLocaleLowerCase())) {
                    targetItem = attributeItemMap.get(attributeValues[j].toLocaleLowerCase())!;
                } else {
                    targetItem = await getOrCreateConfigurationItem(attributeValues[j], targetItemType.id!, accompanyingAttributes, req.authentication);
                    attributeItemMap.set(attributeValues[j].toLocaleLowerCase(), targetItem);
                }
                changedItems.push(targetItem);
                // create connections for all the items with the attribute of that value
                for (let k = 0; k < sourceItems.length; k++) {
                    const sourceItem = sourceItems[k];
                    let newConnection;
                    if (newItemIsUpperType) {
                        newConnection = await getOrCreateConnection(targetItem.id!, sourceItem.id!, connectionRule.id!, '', req.authentication);
                    } else {
                        newConnection = await getOrCreateConnection(sourceItem.id!, targetItem.id!, connectionRule.id!, '', req.authentication);
                    }
                    // after creation, delete attribute and all accompanying attributes in the items
                    if (newConnection) {
                        changedConnections.push(new Connection(newConnection));
                        sourceItem.attributes = sourceItem.attributes.filter(a => a.typeId !== req.attributeType.id &&
                            !accompanyingAttributes.map(aa => aa.typeId).includes(a.typeId));
                        const changedItem = await configurationItemModelUpdate(req.authentication, sourceItem.id, sourceItem.name, sourceItem.typeId,
                            sourceItem.responsibleUsers, sourceItem.attributes, sourceItem.links);
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
        socket.emit(connectionCat, createCtx, connection);
    }
    return connection;
}

async function getOrCreateConfigurationItem(name: string, type: string, attributes: ItemAttribute[], creator: IUser) {
    let item = await configurationItemModelFindOne(name, type);
    if (!item) {
        item = await configurationItemModelCreate([creator.name], creator.id!, creator, name, type,
            attributes.map(a => ({...a, _id: undefined})), []);
        // tbd: create Historic item
        socket.emit(configurationItemCat, createCtx, item);
    }
    return item;
}

async function getOrCreateItemType(name: string, color: string, attributeGroups: {[idField]: string}[]) {
    let newItemType = await itemTypeModelFindOne(name);
    if (!newItemType) {
        newItemType = await itemTypeModelCreate(name, color, attributeGroups.map(ag => ag[idField]));
        socket.emit(itemTypeCat, createCtx, newItemType);
    }
    return newItemType;
}

async function getOrCreateConnectionRule(upperType: IItemType, lowerType: IItemType, connectionTypeId: string) {
    let connectionRule = await connectionRuleModelFindByContent(upperType._id, lowerType._id, connectionTypeId);
    if (!connectionRule) {
        connectionRule = await connectionRuleModelCreate(connectionTypeId, lowerType._id, upperType._id, '^.*$', 9999, 9999);
        socket.emit(connectionRuleCat, createCtx, connectionRule);
    }
    return connectionRule;
}
