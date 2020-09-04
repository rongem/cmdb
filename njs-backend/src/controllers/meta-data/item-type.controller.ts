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
    itemTypeField,
    itemTypeIdField,
    attributeGroupField,
    attributeGroupIdField,
    attributeGroupsField,
    colorField,
    connectionTypeField,
    attributesField,
    typeField
} from '../../util/fields.constants';
import { mappingAlreadyExistsMsg, disallowedDeletionOfItemTypeMsg } from '../../util/messages.constants';
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
    itemTypeModel.findById(req.params[idField])
        .then(itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            return res.json(new ItemType(itemType));
        })
        .catch(error => serverError(next, error));
}

export function getItemTypeAttributeMapping(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[itemTypeField])
        .then(itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            const attributeGroupId = itemType.attributeGroups.find(ag => ag.toString() === req.params[attributeGroupField]);
            if (!attributeGroupId) {
                throw notFoundError;
            }
            const mapping = new ItemTypeAttributeGroupMapping();
            mapping.itemTypeId = itemType.id;
            mapping.attributeGroupId = attributeGroupId.toString();
            return res.json(mapping);
        })
        .catch(error => serverError(next, error));
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
    itemTypeModel.findById(req.body[itemTypeIdField])
        .then(async itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            const ag = await attributeGroupModel.findById(req.body[attributeGroupIdField]);
            if (!ag) {
                throw notFoundError;
            }
            const existingAttributeGroups = itemType.attributeGroups.map(ag => ag.toString());
            if (existingAttributeGroups.includes(req.body[attributeGroupIdField])) {
                throw new HttpError(422, mappingAlreadyExistsMsg);
            }
            itemType.attributeGroups.push(ag._id);
            return itemType.save();

        })
        .then(() => {
            const m = new ItemTypeAttributeGroupMapping();
            m.itemTypeId = req.body[itemTypeIdField];
            m.attributeGroupId = req.body[attributeGroupIdField];
            socket.emit(mappingCat, createCtx, m);
            return res.json(m);
        })
        .catch(error => serverError(next, error));
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
                })
            }
            existingAttributeGroupIds.forEach(id => {
                itemType.attributeGroups.splice(itemType.attributeGroups.findIndex(a => a.id === id), 1);
                changed = true;
            })
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

export function deleteItemTypeAttributeGroupMapping(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[idField])
        .then(itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            const ag = itemType.attributeGroups.find(ag => ag.toString() === req.params[attributeGroupField]);
            if (!ag) {
                throw notFoundError;
            }
            itemType.attributeGroups = itemType.attributeGroups.filter(ag => ag !== ag);
            return itemType.save();
        })
        .then(() => {
            const m = new ItemTypeAttributeGroupMapping();
            m.itemTypeId = req.params[itemTypeField];
            m.attributeGroupId = req.params[attributeGroupField];
            socket.emit(mappingCat, deleteCtx, m);
            return res.json(m);
        })
        .catch(error => serverError(next, error));
}

export function canDeleteItemType(req: Request, res: Response, next: NextFunction) {
    configurationItemModel.find({ itemType: req.params[idField] }).estimatedDocumentCount()
        .then(value => { return res.json(value === 0) })
        .catch(error => serverError(next, error));
}

export function canDeleteItemTypeAttributeGroupMapping(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.find({ attributeGroup: req.params[attributeGroupField] })
        .then(async attributeTypes => {
            if (!attributeTypes || attributeTypes.length === 0) {
                return res.json(true);
            }
            const count = await configurationItemModel.find({ [`${attributesField}.${typeField}'`]: { $in: attributeTypes.map(at => at._id) } }).estimatedDocumentCount();
            return res.json(count === 0);
        })
        .catch(error => serverError(next, error));
}
