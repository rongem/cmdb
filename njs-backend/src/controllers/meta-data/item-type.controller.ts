import { Request, Response, NextFunction } from 'express';

import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { IAttributeGroup } from '../../models/mongoose/attribute-group.model';
import { attributeTypeModel, IAttributeType } from '../../models/mongoose/attribute-type.model';
import { connectionRuleModel, IConnectionRule } from '../../models/mongoose/connection-rule.model';
import { connectionTypeModel } from '../../models/mongoose/connection-type.model';
import { IItemType, IItemTypePopulated, itemTypeModel } from '../../models/mongoose/item-type.model';
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
import { disallowedDeletionOfItemTypeMsg, disallowedDeletionOfMappingMsg, nothingChanged } from '../../util/messages.constants';
import { itemTypeCat, createCtx, updateCtx, deleteCtx, mappingCat } from '../../util/socket.constants';
import { Types } from 'mongoose';
import { AttributeGroup } from '../../models/meta-data/attribute-group.model';

// Read
export function getItemTypes(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.find()
        .then((itemTypes: IItemType[]) => res.json(itemTypes.map(it => new ItemType(it))))
        .catch((error: any) => serverError(next, error));
}

export function getItemTypesForUpperItemTypeAndConnection(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[idField])
        .then(async (itemType: IItemType) => {
            if (!itemType) {
                throw notFoundError;
            }
            const ct = await connectionTypeModel.findById(req.params[connectionTypeField]);
            if (!ct) {
                throw notFoundError;
            }
            const ids = await connectionRuleModel.find({ upperItemType: itemType._id, connectionType: ct._id })
                .map((rs: IConnectionRule[]) => rs.map(r => r.lowerItemType));
            const itemTypes = await itemTypeModel.find({ _id: { $in: ids } }).map((its: IItemType[]) => its.map(it => new ItemType(it)));
            return res.json(itemTypes);
        })
        .catch((error: any) => serverError(next, error));
}

export function getItemTypesForLowerItemTypeAndConnection(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[idField])
        .then(async (itemType: IItemType) => {
            if (!itemType) {
                throw notFoundError;
            }
            const ct = await connectionTypeModel.findById(req.params[connectionTypeField]);
            if (!ct) {
                throw notFoundError;
            }
            const ids = await connectionRuleModel.find({ lowerItemType: itemType._id, connectionType: ct._id })
                .map((rs: IConnectionRule[]) => rs.map(r => r.upperItemType));
            const itemTypes = await itemTypeModel.find({ _id: { $in: ids } })
                .map((its: IItemType[]) => its.map(it => new ItemType(it)));
            return res.json(itemTypes);
        })
        .catch((error: any) => serverError(next, error));
}

export function getItemTypesByAllowedAttributeType(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.findById(req.params[idField])
        .then(async (attributeType: IAttributeType) => {
            if (!attributeType) {
                throw notFoundError;
            }
            const itemTypes = await itemTypeModel.find({ attributeGroups: attributeType.attributeGroup })
                .map((its: IItemType[]) => its.map(it => new ItemType(it)));
            return res.json(itemTypes);
        })
        .catch((error: any) => serverError(next, error));
}

export function getItemTypeAttributeMappings(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.find()
        .then((itemTypes: IItemType[]) => res.json(ItemTypeAttributeGroupMapping.createAllMappings(itemTypes)))
        .catch((error: any) => serverError(next, error));
}

export function getItemType(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[idField]).populate(attributeGroupsField)
        .then((itemType: IItemType) => {
            if (!itemType) {
                throw notFoundError;
            }
            return res.json(new ItemType(itemType));
        })
        .catch((error: any) => serverError(next, error));
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
    const attributeTypes = (await attributeTypeModel.find({ attributeGroup: attributeGroupId })).map((a: IAttributeType) => a._id);
    const count = await configurationItemModel.find({ type: itemTypeId, 'attributes.type': { $in: attributeTypes } }).countDocuments();
    return count;
}

// Create
export function createItemType(req: Request, res: Response, next: NextFunction) {
    const name = req.body[nameField] as string;
    const color = req.body[colorField] as string;
    const attributeGroups = (req.body[attributeGroupsField] as {[idField]: string}[] ?? []).map(ag => ag[idField]); // 
    itemTypeModelCreate(name, color, attributeGroups).then(itemType => {
        socket.emit(itemTypeCat, createCtx, itemType);
        res.status(201).json(itemType);
    }).catch((error: any) => serverError(next, error));
}

async function itemTypeModelCreate(name: string, color: string, attributeGroups: string[]) {
    let itemType = await itemTypeModel.create({ name, color, attributeGroups });
    if (!itemType) {
        throw new HttpError(422, 'not created');
    }
    itemType = await itemType.populate({ path: attributeGroupsField, select: nameField }).execPopulate();
    return new ItemType(itemType);
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
    const id = req.params[idField] as string;
    const name = req.body[nameField] as string;
    const color = req.body[colorField] as string;
    const attributeGroups = (req.body[attributeGroupsField] as {[idField]: string}[] ?? []).map(a => a[idField]);
    itemTypeModelUpdate(id, name, color, attributeGroups)
        .then((itemType: ItemType) => {
            if (itemType) {
                socket.emit(itemTypeCat, updateCtx, itemType);
                return res.json(itemType);
            }
        })
        .catch((error: HttpError) => {
            if (error.httpStatusCode === 304) {
                res.sendStatus(304);
                return;
            }
            serverError(next, error);
        });
}

async function itemTypeModelUpdate(id: string, name: string, color: string, attributeGroups: string[]) {
    let itemType: IItemType = await itemTypeModel.findById(id);
    if (!itemType) {
        throw notFoundError;
    }
    let changed = false;
    if (itemType.name !== name) {
        itemType.name = name;
        changed = true;
    }
    if (itemType.color !== color) {
        itemType.color = color;
        changed = true;
    }
    const existingAttributeGroupIds: string[] = itemType.attributeGroups.map(ag => ag.toString());
    if (attributeGroups.length > 0) {
        attributeGroups.forEach(ag => {
            if (existingAttributeGroupIds.includes(ag)) {
                existingAttributeGroupIds.splice(existingAttributeGroupIds.indexOf(ag), 1);
            } else {
                itemType.attributeGroups.push(ag);
                changed = true;
            }
        });
    }
    existingAttributeGroupIds.forEach(agid => {
        itemType.attributeGroups.splice(itemType.attributeGroups.findIndex(a => a.toString() === agid), 1);
        changed = true;
    });
    if (!changed) {
        throw new HttpError(304, nothingChanged);
    }
    itemType = await itemType.save();
    if (!itemType) {
        throw new HttpError(422, 'update failed');
    }
    itemType = await itemType.populate({ path: attributeGroupsField, select: nameField }).execPopulate();
    return new ItemType(itemType);
}

// Delete
export function deleteItemType(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[idField])
        .then((itemType: IItemType) => {
            if (!itemType) {
                throw notFoundError;
            }
            if (itemType.attributeGroups && itemType.attributeGroups.length > 0) {
                throw new HttpError(422, disallowedDeletionOfItemTypeMsg);
            }
            return itemType.remove();
        })
        .then((itemType: IItemType) => {
            const it = new ItemType(itemType);
            socket.emit(itemTypeCat, updateCtx, it);
            return res.json(it);
        })
        .catch((error: any) => serverError(next, error));
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
        .then((docs: number) => res.json(docs === 0))
        .catch((error: any) => serverError(next, error));
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
