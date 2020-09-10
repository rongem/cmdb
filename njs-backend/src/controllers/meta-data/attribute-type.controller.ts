import { Request, Response, NextFunction } from 'express';

import { attributeTypeModel } from '../../models/mongoose/attribute-type.model';
import { configurationItemModel, IAttribute, IConfigurationItem } from '../../models/mongoose/configuration-item.model';
import { itemTypeModel, IItemType } from '../../models/mongoose/item-type.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { serverError, notFoundError } from '../error.controller';
import socket from '../socket.controller';
import { idField, nameField, attributeGroupIdField, validationExpressionField, newItemTypeNameField, colorField, positionField, connectionTypeField } from '../../util/fields.constants';
import { attributeTypeCat, createCtx, updateCtx, deleteCtx } from '../../util/socket.constants';
import { connectionRuleModel } from '../../models/mongoose/connection-rule.model';
import { IUser } from '../../models/mongoose/user.model';

// read
export function getAttributeTypes(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.find()
        .then(attributeTypes => {
            return res.json(attributeTypes.map(at => new AttributeType(at)));
        })
        .catch(error => serverError(next, error));
}

export function getAttributeTypesForAttributeGroup(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.find({attributeGroup: req.params[idField]})
        .then(attributeTypes => res.json(attributeTypes.map(at => new AttributeType(at))))
        .catch(error => serverError(next, error));
}

export function getAttributeTypesForItemType(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[idField])
        .then(itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            return attributeTypeModel.find({attributeGroup: {$in: itemType.attributeGroups}}).sort(nameField);
        })
        .then(attributeTypes => res.json(attributeTypes.map(at => new AttributeType(at))))
        .catch(error => serverError(next, error));
}

export function getCorrespondingAttributeTypes(req: Request, res: Response, next: NextFunction) {} // tbd

export function getAttributeType(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.findById(req.params[idField])
        .then(at => {
            if (!at) {
                throw notFoundError;
            }
            res.json(new AttributeType(at));
        })
        .catch(error => serverError(next, error));
}

export function countAttributesForAttributeType(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.findById(req.params[idField]).countDocuments()
        .then(async (typesCount) => {
            if (typesCount !== 1) {
                throw notFoundError;
            }
            const count = await configurationItemModel.find({'attributes.type': req.params[idField]}).countDocuments();
            res.json(count);
        })
        .catch(error => serverError(next, error));
}

// create
export function createAttributeType(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.create({
        name: req.body[nameField],
        attributeGroup: req.body[attributeGroupIdField],
        validationExpression: req.body[validationExpressionField]
    }).then(value => {
        const at = new AttributeType(value);
        socket.emit(attributeTypeCat, createCtx, at);
        res.status(201).json(at);
    }).catch(error => serverError(next, error));
}

// update
export function updateAttributeType(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.findById(req.params[idField])
        .then(value => {
            if (!value) {
                throw notFoundError;
            }
            let changed = false;
            if (value.name !== req.body[nameField]) {
                value.name = req.body[nameField];
                changed = true;
            }
            if (value.attributeGroup.toString() !== req.body[attributeGroupIdField]) {
                value.attributeGroup = req.body[attributeGroupIdField];
                changed = true;
            }
            if (value.validationExpression !== req.body[validationExpressionField]) {
                value.validationExpression = req.body[validationExpressionField];
                changed = true;
            }
            if (!changed) {
                res.sendStatus(304);
                return;
            }
            return value.save();
        })
        .then(value => {
            if (value) {
                const at = new AttributeType(value);
                socket.emit(attributeTypeCat, updateCtx, at);
                res.json(at);
            }
        })
        .catch(error => serverError(next, error));
}

// delete
export function deleteAttributeType(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.findById(req.params[idField])
        .then(attributeType => {
            if (!attributeType) {
                throw notFoundError;
            }
            return attributeType.remove();
        })
        .then(value => { // delete attributes in schema
            if (value) {
                const at = new AttributeType(value);
                socket.emit(attributeTypeCat, deleteCtx, at);
                res.json(at);
            }
        })
        .catch(error => serverError(next, error));
}

export function canDeleteAttributeType(req: Request, res: Response, next: NextFunction) {
    configurationItemModel.find({attributes: [{attributeType: req.params[idField]} as unknown as IAttribute]}).countDocuments()
        .then(docs => res.json(docs === 0))
        .catch(error => serverError(next, error));
}

export async function convertAttributeTypeToItemType(req: Request, res: Response, next: NextFunction) {
    try {
        const allowedItemTypes = await itemTypeModel.find({ attributeGroups: req.attributeType.attributeGroup });
        const newItemType = await getOrCreateItemType(req.body[newItemTypeNameField],
            req.body[colorField], [...new Set(req.attributeTypes.map(a => a.attributeGroup))]);
        const newItemIsUpperType = req.body[positionField] === 'above';
        const changedItems = [];
        const createdItems = [];
        const attributeItemMap = new Map<string, IConfigurationItem>();
        // tslint:disable: prefer-for-of
        for (let index = 0; index < allowedItemTypes.length; index++) {
            const targetItemType = allowedItemTypes[index];
            const upperType = newItemIsUpperType ? newItemType : targetItemType;
            const lowerType = newItemIsUpperType ? targetItemType : newItemType;
            const connectionRule = await getOrCreateConnectionRule(upperType, lowerType, req.body[connectionTypeField]);
            const items = await configurationItemModel.find({type: targetItemType._id, 'attributes.type': req.attributeType._id});
            const attributeValues = getUniqueAttributeValues(items, req.attributeType._id.toString());
            for (let j = 0; j < attributeValues.length; j++) {
                let targetItem: IConfigurationItem;
                const sourceItems = items.filter(i => i.attributes.some(a => a.type.toString() === req.body[idField] &&
                    a.value.toLocaleLowerCase() === attributeValues[j].toLocaleLowerCase()));
                const accompanyingAttributes = sourceItems[0].attributes.filter(a => req.attributeTypes.map(t => t.id).includes(a.type.toString()));
                if (attributeItemMap.has(attributeValues[j].toLocaleLowerCase())) {
                    targetItem = attributeItemMap.get(attributeValues[j].toLocaleLowerCase()) as IConfigurationItem;
                } else {
                    targetItem = await getOrCreateConfigurationItem(attributeValues[j], targetItemType.id, accompanyingAttributes, req.authentication);
                    attributeItemMap.set(attributeValues[j].toLocaleLowerCase(), targetItem);
                }
            }
            for (let j = 0; j < items.length; j++) {
                const item = items[j];
            }
        }
        res.status(201).json({
            itemType: newItemType,
        });
    } catch (error) {
        serverError(next, error);
    }
    // tbd
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

async function getOrCreateConfigurationItem(name: string, type: string, attributes: IAttribute[], creator: IUser) {
    let item = await configurationItemModel.findOne({name, type});
    if (!item) {
        item = await configurationItemModel.create({
            attributes,
            links: [],
            responsibleUsers: [creator],
            name,
            type,
        });
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
    }
    return connectionRule;
}
