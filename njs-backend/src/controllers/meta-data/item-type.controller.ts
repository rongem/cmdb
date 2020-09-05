import { Request, Response, NextFunction } from 'express';

import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { attributeGroupModel, IAttributeGroup } from '../../models/mongoose/attribute-group.model';
import { attributeTypeModel } from '../../models/mongoose/attribute-type.model';
import { connectionRuleModel } from '../../models/mongoose/connection-rule.model';
import { connectionTypeModel } from '../../models/mongoose/connection-type.model';
import { itemTypeModel } from '../../models/mongoose/item-type.model';
import { ItemType } from '../../models/meta-data/item-type.model';
import { ItemTypeAttributeGroupMapping } from '../../models/meta-data/item-type-attribute-group-mapping.model';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';
import {
    idField,
    nameField,
    itemTypeIdField,
    attributeGroupIdField,
    attributeGroupsField,
    colorField,
    connectionTypeField,
} from '../../util/fields.constants';
import { mappingAlreadyExistsMsg, disallowedDeletionOfItemTypeMsg, disallowedDeletionOfMappingMsg } from '../../util/messages.constants';
import { itemTypeCat, createCtx, updateCtx, deleteCtx, mappingCat } from '../../util/socket.constants';
import { Types } from 'mongoose';
import { AttributeGroup } from '../../models/meta-data/attribute-group.model';

// Read
export function getItemTypes(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.find()
        .then(itemTypes => res.json(itemTypes.map(it => new ItemType(it))))
        .catch(error => serverError(next, error));
}

export function getItemTypesForUpperItemTypeAndConnection(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[idField])
        .then(async itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            const ct = await connectionTypeModel.findById(req.params[connectionTypeField]);
            if (!ct) {
                throw notFoundError;
            }
            const ids = await connectionRuleModel.find({ upperItemType: itemType._id, connectionType: ct._id })
                .map(rs => rs.map(r => r.lowerItemType));
            const itemTypes = await itemTypeModel.find({ _id: { $in: ids } }).map(its => its.map(it => new ItemType(it)));
            return res.json(itemTypes);
        })
        .catch(error => serverError(next, error));
}

export function getItemTypesForLowerItemTypeAndConnection(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[idField])
        .then(async itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            const ct = await connectionTypeModel.findById(req.params[connectionTypeField]);
            if (!ct) {
                throw notFoundError;
            }
            const ids = await connectionRuleModel.find({ lowerItemType: itemType._id, connectionType: ct._id })
                .map(rs => rs.map(r => r.upperItemType));
            const itemTypes = await itemTypeModel.find({ _id: { $in: ids } }).map(its => its.map(it => new ItemType(it)));
            return res.json(itemTypes);
        })
        .catch(error => serverError(next, error));
}

export function getItemTypesByAllowedAttributeType(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.findById(req.params[idField])
        .then(async attributeType => {
            if (!attributeType) {
                throw notFoundError;
            }
            const itemTypes = await itemTypeModel.find({ attributeGroups: attributeType.attributeGroup }).map(its => its.map(it => new ItemType(it)));
            return res.json(itemTypes);
        })
        .catch(error => serverError(next, error));
}

export function getItemTypeAttributeMappings(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.find()
        .then(itemTypes => res.json(ItemTypeAttributeGroupMapping.createAllMappings(itemTypes)))
        .catch(error => serverError(next, error));
}

export function getItemType(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[idField]).populate(attributeGroupsField)
        .then(itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            return res.json(new ItemType(itemType));
        })
        .catch(error => serverError(next, error));
}

export async function countAttributesForItemTypeAttributeMapping(req: Request, res: Response, next: NextFunction) {
    try {
        const count = await countAttributesForMapping(req.params[attributeGroupIdField], req.itemType.id);
        res.json(count);
    }
    catch (error) {
        serverError(next, error);
    }
}

async function countAttributesForMapping(attributeGroupId: string, itemTypeId: string) {
    const attributeTypes = (await attributeTypeModel.find({ attributeGroup: attributeGroupId })).map(a => a._id);
    const count = await configurationItemModel.find({ type: itemTypeId, 'attributes.type': { $in: attributeTypes } }).countDocuments();
    return count;
}

// Create
export function createItemType(req: Request, res: Response, next: NextFunction) {
    return itemTypeModel.create({
        name: req.body[nameField],
        color: req.body[colorField],
        attributeGroups: (req.body[attributeGroupsField] as unknown as AttributeGroup[] ?? []).map(ag => ag.id),
    })
        .then(itemType => {
            const it = new ItemType(itemType);
            socket.emit(itemTypeCat, createCtx, it);
            res.status(201).json(it);
        })
        .catch(error => serverError(next, error));
}

export function createItemTypeAttributeGroupMapping(req: Request, res: Response, next: NextFunction) {
    req.itemType.attributeGroups.push(req.body[attributeGroupIdField]);
    return req.itemType.save()
        .then(() => {
            const m = new ItemTypeAttributeGroupMapping();
            m.itemTypeId = req.body[itemTypeIdField];
            m.attributeGroupId = req.body[attributeGroupIdField];
            socket.emit(mappingCat, createCtx, m);
            return res.json(m);
        })
        .catch((error: any) => serverError(next, error));
}

// Update
export function updateItemType(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[idField])
        .then(itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            let changed = false;
            if (itemType.name !== req.body[nameField]) {
                itemType.name = req.body[nameField];
                changed = true;
            }
            if (itemType.color !== req.body[colorField]) {
                itemType.color = req.body[colorField];
                changed = true;
            }
            const existingAttributeGroupIds: string[] = itemType.attributeGroups.map(ag => itemType.populated(attributeGroupsField) ?
                (ag as IAttributeGroup).id : (ag as Types.ObjectId).toHexString());
            if (req.params[attributeGroupsField]) {
                const attributeGroups = req.params[attributeGroupsField] as unknown as {id: string}[];
                attributeGroups.forEach(ag => {
                    if (existingAttributeGroupIds.includes(ag.id)) {
                        existingAttributeGroupIds.splice(existingAttributeGroupIds.indexOf(ag.id), 1);
                    } else {
                        itemType.attributeGroups.push(ag.id);
                        changed = true;
                    }
                });
            }
            existingAttributeGroupIds.forEach(id => {
                itemType.attributeGroups.splice(itemType.attributeGroups.findIndex(a => a.id === id), 1);
                changed = true;
            });
            if (!changed) {
                res.sendStatus(304);
                return;
            }
            return itemType.save();
        })
        .then(itemType => {
            if (itemType) {
                const it = new ItemType(itemType);
                socket.emit(itemTypeCat, updateCtx, it);
                return res.json(it);
            }
        })
        .catch(error => serverError(next, error));
}

// Delete
export function deleteItemType(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[idField])
        .then(itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            if (itemType.attributeGroups && itemType.attributeGroups.length > 0) {
                throw new HttpError(422, disallowedDeletionOfItemTypeMsg);
            }
            return itemType.remove();
        })
        .then(itemType => {
            const it = new ItemType(itemType);
            socket.emit(itemTypeCat, updateCtx, it);
            return res.json(it);
        })
        .catch(error => serverError(next, error));
}

export async function deleteItemTypeAttributeGroupMapping(req: Request, res: Response, next: NextFunction) {
    try {
        const count = await countAttributesForMapping(req.params[attributeGroupIdField], req.itemType.id);
        if (count > 0) {
            throw new Error(disallowedDeletionOfMappingMsg);
        }
        req.itemType.attributeGroups.splice(req.itemType.attributeGroups.map((g: any) => g.toString()).indexOf(req.params[attributeGroupIdField]), 1);
        const itemType = await req.itemType.save();
        const m = new ItemTypeAttributeGroupMapping();
        m.itemTypeId = itemType.id;
        m.attributeGroupId = req.params[attributeGroupIdField];
        socket.emit(mappingCat, deleteCtx, m);
        res.json(m);
    }
    catch (error) {
        serverError(next, error);
    }
}

export function canDeleteItemType(req: Request, res: Response, next: NextFunction) {
    configurationItemModel.find({ itemType: req.params[idField] }).countDocuments()
        .then(value => res.json(value === 0))
        .catch(error => serverError(next, error));
}

export async function canDeleteItemTypeAttributeGroupMapping(req: Request, res: Response, next: NextFunction) {
    try {
        const count = await countAttributesForMapping(req.params[attributeGroupIdField], req.itemType.id);
        res.json(count === 0);
    }
    catch (error) {
        serverError(next, error);
    }
}
