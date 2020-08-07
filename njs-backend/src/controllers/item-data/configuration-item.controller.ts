import { Request, Response, NextFunction } from 'express';

import configurationItemModel, { IAttribute } from '../../models/mongoose/configuration-item.model';
import { handleValidationErrors } from '../../routes/validators';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { ItemAttribute } from '../../models/item-data/item-attribute.model';
import { ItemLink } from '../../models/item-data/item-link.model';

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

// Delete
