import { Request, Response, NextFunction } from 'express';

import configurationItemModel from '../../models/mongoose/configuration-item.model';
import attributeGroupModel from '../../models/mongoose/attribute-group.model';
import itemTypesModel from '../../models/mongoose/item-type.model';
import { ItemType } from '../../models/meta-data/item-type.model';
import { ItemTypeAttributeGroupMapping } from '../../models/meta-data/item-type-attribute-group-mapping.model';
import { handleValidationErrors } from '../../routes/validators';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';
import attributeTypeModel from '../../models/mongoose/attribute-type.model';

// Read
export function getItemTypes(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    itemTypesModel.find().sort('name')
        .then(itemTypes => res.json(itemTypes.map(it => new ItemType(it))))
        .catch(error => serverError(next, error));
}
    
export function getItemTypeAttributeMappings(req: Request, res: Response, next: NextFunction) {
    itemTypesModel.find()
        .then(itemTypes => res.json(ItemTypeAttributeGroupMapping.createAllMappings(itemTypes)))
        .catch(error => serverError(next, error));
}
    
export function getItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    itemTypesModel.findById(req.params.id)
        .then(itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            return res.json(new ItemType(itemType));
        })
        .catch(error => serverError(next, error));
}

export function getItemTypeAttributeMapping(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    itemTypesModel.findById(req.params.itemType)
        .then(itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            const attributeGroupId = itemType.attributeGroups.find(ag => ag.toString() === req.params.attributeGroup);
            if (!attributeGroupId) {
                throw notFoundError;
            }
            const mapping = new ItemTypeAttributeGroupMapping();
            mapping.itemTypeId = itemType._id.toString();
            mapping.attributeGroupId = attributeGroupId.toString();
            return res.json(mapping);
        })
        .catch(error => serverError(next, error));
}

// Create
export function createItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    return itemTypesModel.create({
        name: req.body.name,
        color: req.body.color,
        attributeGroups: req.body.attributesGroups ?? [],
    })
        .then(itemType => {
            const it = new ItemType(itemType);
            socket.emit('item-types', 'create', it);
            res.status(201).json(it);
        })
        .catch(error => serverError(next, error));
}

export function createItemTypeAttributeGroupMapping(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    itemTypesModel.findById(req.body.itemType)
        .then(async itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            const attributGroup = await attributeGroupModel.findById(req.body.attributeGroup);
            if (!attributGroup) {
                throw notFoundError;
            }
            const existingAttributeGroups = itemType.attributeGroups.map(ag => ag.toString());
            if (existingAttributeGroups.includes(req.body.attibuteGroup)) {
                throw new HttpError(422, 'Mapping between this item type and this attribute group already exists.');
            }
            itemType.attributeGroups.push(attributGroup._id);
            return itemType.save();

        })
        .then(() => {
            const m = new ItemTypeAttributeGroupMapping();
            m.itemTypeId = req.body.itemType;
            m.attributeGroupId = req.body.attributeGroup;
            socket.emit('item-type-attribute-group-mapping', 'create', m);
            return res.json(m);
        })
        .catch(error => serverError(next, error));
}

// Update
export function updateItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    itemTypesModel.findById(req.params.id)
        .then(itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            let changed = false;
            if (itemType.name !== req.body.name) {
                itemType.name = req.body.name;
                changed = true;
            }
            if (itemType.color !== req.body.color) {
                itemType.color = req.body.color;
                changed = true;
            }
            if (!changed) {
                res.status(304);
                return;
            }
            return itemType.save();
        })
        .then(itemType => {
            if (itemType) {
                const it = new ItemType(itemType);
                socket.emit('item-type', 'update', it);
                return res.send(it);
            }
        })
        .catch(error => serverError(next, error));
}

// Delete
export function deleteItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    itemTypesModel.findById(req.params.id)
        .then(itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            if (itemType.attributeGroups && itemType.attributeGroups.length > 0) {
                throw new HttpError(422, 'Item type still holds attribute group mappings');
            }
            return itemType.remove();
        })
        .then(itemType => res.json(new ItemType(itemType)))
        .catch(error => serverError(next, error));
}

export function deleteItemTypeAttributeGroupMapping(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    itemTypesModel.findById(req.params.id)
        .then(itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            const attributeGroup = itemType.attributeGroups.find(ag => ag.toString() === req.params.attributeGroup);
            if (!attributeGroup) {
                throw notFoundError;
            }
            itemType.attributeGroups = itemType.attributeGroups.filter(ag => ag !== attributeGroup);
            return itemType.save();
        })
        .then(() => {
            const m = new ItemTypeAttributeGroupMapping();
            m.itemTypeId = req.params.itemType;
            m.attributeGroupId = req.params.attributeGroup;
            socket.emit('item-type-attribute-group-mapping', 'delete', m);
            return res.json(m);
        })
        .catch(error => serverError(next, error));
}

export function canDeleteItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    configurationItemModel.find({itemType: req.params.id}).estimatedDocumentCount()
        .then(value => {return res.json(value === 0)})
        .catch(error => serverError(next, error));
}

export function canDeleteItemTypeAttributeGroupMapping(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeTypeModel.find({attributeGroup: req.params.attributeGroupId})
        .then(async attributeTypes => {
            if (!attributeTypes || attributeTypes.length === 0) {
                return res.json(true);
            }
            const attributes = await configurationItemModel.find({'attributes.type': {$in: attributeTypes.map(at => at._id)}});
            return res.json(!attributes || attributes.length === 0);
        })
        .catch(error => serverError(next, error));
}
