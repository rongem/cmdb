import { Request, Response, NextFunction } from 'express';

import configurationItemModel, { IAttribute, IConfigurationItem } from '../../models/mongoose/configuration-item.model';
import itemTypeModel from '../../models/mongoose/item-type.model';
import attributeGroupModel from '../../models/mongoose/attribute-group.model';
import attributeTypeModel from '../../models/mongoose/attribute-type.model';
import { handleValidationErrors } from '../../routes/validators';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { ItemAttribute } from '../../models/item-data/item-attribute.model';
import { ItemLink } from '../../models/item-data/item-link.model';
import { IUser } from '../../models/mongoose/user.model';
import connectionModel from '../../models/mongoose/connection.model';
import connectionTypeModel from '../../models/mongoose/connection-type.model';
import { Connection } from '../../models/item-data/connection.model';

// Validation
export async function validateConfigurationItem(req: Request, res: Response, next: NextFunction) {
    try {
        handleValidationErrors(req);
        const itemType = await itemTypeModel.findById(req.body.typeId);
        if (!itemType) {
            serverError(next, new HttpError(404, 'No item type with this id.', req.body.typeId));
            return;
        }
        const allowedAttributeTypes = await attributeTypeModel.find({attributeGroup: {$in: itemType.attributeGroups}});
        const attributes: ItemAttribute[] = req.body.attributes;
        const requestedAttributeTypes = await attributeTypeModel.find({_id: {$in: attributes.map(a => a.typeId)}});
        const nonExistingTypes: ItemAttribute[] = [];
        const existingIds: string[] = [];
        const duplicateIds: string[] = [];
        attributes.forEach(a => {
            if (!requestedAttributeTypes.find(at => at._id.toString() === a.typeId)) {
                nonExistingTypes.push(a);
            } else if (existingIds.includes(a.typeId)) {
                duplicateIds.push(a.typeId);
            } else {
                existingIds.push(a.typeId);
            }
        })
        if (nonExistingTypes.length > 0) {
            serverError(next, new HttpError(404, 'Not all attribute type ids are valid.', nonExistingTypes));
            return;
        }
        if (duplicateIds.length > 0) {
            serverError(next, new HttpError(422, 'Each type id may be used only once per item.', duplicateIds));
            return;
        }
        const attributeTypeIds: string[] = allowedAttributeTypes.map(at => at._id.toString());
        if(attributes.some(a => !attributeTypeIds.includes(a.typeId))) {
            const nonAllowedTypes: ItemAttribute[] = [];
            attributes.forEach(a => {
                if (!attributeTypeIds.includes(a.typeId)) {
                    nonAllowedTypes.push(a);
                }
            })
            serverError(next, new HttpError(422, 'Not all attribute types are allowed for this item type', nonAllowedTypes));
            return;
        }
        next();
    } catch(error) {
        serverError(next, error);
    }
}

function checkResponsibility(user: IUser | undefined, item: IConfigurationItem) {
    if (!user || !item.responsibleUsers.map(u => u.name.toLocaleLowerCase()).includes(user.name.toLocaleLowerCase())) {
        throw new HttpError(403, 'User is not responsible for this item. Take responsibility before updating');
    }
}

// Read
export async function getConfigurationItems(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    const max = 1000;
    const totalItems = await configurationItemModel.find().estimatedDocumentCount();
    configurationItemModel.find()
        .populate({path: 'itemType', select: 'name'})
        .populate({path: 'attributes.type', select: 'name'})
        .populate({path: 'responsibleUsers', select: 'name'})
        .sort({'itemType.name': 1, name: 1})
        .skip((+req.params.page - 1) * max).limit(max)
        .then(items => res.json({
            items: items.map(item => new ConfigurationItem(item)),
            totalItems,
        }))
        .catch(error => serverError(next, error));
}

export function getConfigurationItemsByType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    configurationItemModel.find({type: req.params.id})
        .then(items => res.json(items.map(item => new ConfigurationItem(item))))
        .catch(error => serverError(next, error));
}

export function getConfigurationItem(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    configurationItemModel.findById(req.params.id)
        .populate({path: 'itemType', select: 'name'})
        .populate({path: 'attributes.type', select: 'name'})
        .populate({path: 'responsibleUsers', select: 'name'})
        .then(item => {
            if (!item) {
                throw notFoundError;
            }
            res.json(new ConfigurationItem(item));
        })
        .catch(error => serverError(next, error));
}

// Create
export function createConfigurationItem(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    const lastChange = new Date();
    const userId = req.authentication ? req.authentication._id.toString() : '';
    const attributes = req.body.attributes.map((a: ItemAttribute) => ({
        value: a.value,
        type: a.typeId,
        lastChange,
    }));
    const links = req.body.links.map((l: ItemLink) => ({
        uri: l.uri,
        description: l.description,
    }));
    configurationItemModel.create({
        name: req.body.name,
        type: req.body.typeId,
        lastChange: new Date(),
        responsibleUsers: [userId],
        attributes,
        links,
    })
        .then(item => {
            const ci = new ConfigurationItem(item);
            socket.emit('configuration-item', 'create', ci);
            return res.status(201).json(ci);
        })
        .catch(error => serverError(next, error));
}

// Update
export function updateConfigurationItem(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    configurationItemModel.findById(req.params.id)
        .populate({path: 'responsibleUsers', select: 'name'})
        .then(item => {
            if (!item) {
                throw notFoundError;
            }
            checkResponsibility(req.authentication, item);
            if (item.type.toString() !== req.body.typeId) {
                throw new HttpError(422, 'Changing the item type is not allowed.', {oldType: item.type.toString(), newType: req.body.typeId});
            }
            let changed = false;
            if (item.name !== req.body.name) {
                item.name = req.body.name;
                changed = true;
            }
            // tbd: attributes and links
            if (!changed) {
                res.sendStatus(304);
                return;
            }
            return item.save();
        })
        .then(item => {
            if (item) {
                const ci = new ConfigurationItem(item);
                socket.emit('configuration-item', 'update', item);
                res.json(ci);
            }
        })
        .catch(error => serverError(next, error));
}

// Delete
export function deleteConfigurationItem(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    configurationItemModel.findById(req.params.id)
        .populate({path: 'responsibleUsers', select: 'name'})
        .then(async item => {
            if (!item) {
                throw notFoundError;
            }
            checkResponsibility(req.authentication, item);
            const deletedConnections = await connectionModel
                .find({$or: [{upperItem: item._id}, {lowerItem: item._id}]})
                .populate({path: 'connectionType', select: 'name'});
            connectionModel.remove({$or: [{upperItem: item._id}, {lowerItem: item._id}]}, err => serverError(next, err));
            const deletedItem = await item.remove();
            return {deletedItem, deletedConnections};
        })
        .then(result => {
            const item = new ConfigurationItem(result.deletedItem);
            socket.emit('configuration-item', 'delete', item);
            const connections: Connection[] = [];
            if (result.deletedConnections.length > 1) {
                result.deletedConnections.forEach(c => connections.push(new Connection(c)));
                socket.emit('connection', 'deleted-many', connections);
            } else if (result.deletedConnections.length === 1) {
                socket.emit('connection', 'deleted', new Connection(result.deletedConnections[0]));
            }
            res.json({item, connections});
        })
        .catch(error => serverError(next, error));
}
