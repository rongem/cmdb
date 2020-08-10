import { Request, Response, NextFunction } from 'express';

import attributeTypesModel from '../../models/mongoose/attribute-type.model';
import configurationItemModel from '../../models/mongoose/configuration-item.model';
import itemTypeModel from '../../models/mongoose/item-type.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { handleValidationErrors } from '../../routes/validators';
import { serverError, notFoundError } from '../error.controller';
import socket from '../socket.controller';
import { idField, attributeGroupField, validationExpressionField } from '../../util/fields.constants';

// read
export function getAttributeTypes(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeTypesModel.find().sort('name')
        .then(attributeTypes => res.json(attributeTypes.map(at => new AttributeType(at))))
        .catch(error => serverError(next, error));
}

export function getAttributeTypesForAttributeGroup(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeTypesModel.find({attributeGroup: req.params[idField]}).sort('name')
        .then(attributeTypes => res.json(attributeTypes.map(at => new AttributeType(at))))
        .catch(error => serverError(next, error));
}

export function getAttributeTypesForItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    itemTypeModel.findById(req.params[idField])
        .then(itemType => {
            if (!itemType) {
                throw notFoundError;
            }
            return attributeTypesModel.find({attributeGroup: {$in: itemType.attributeGroups}}).sort('name')
        })
        .then(attributeTypes => res.json(attributeTypes.map(at => new AttributeType(at))))
        .catch(error => serverError(next, error));
}

export function getCorrespondingAttributeTypes(req: Request, res: Response, next: NextFunction) {} // tbd

export function getAttributeType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeTypesModel.findById(req.params[idField])
        .then(at => {
            if (!at) {
                throw notFoundError;
            }
            return res.json(new AttributeType(at));
        })
        .catch(error => serverError(next, error));
}

// create
export function createAttributeType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeTypesModel.create({
        name: req.body[name],
        attributeGroup: req.body[attributeGroupField],
        validationExpression: req.body[validationExpressionField]
    }).then(value => {
        const at = new AttributeType(value);
        socket.emit('attribute-types', 'create', at);
        return res.status(201).json(at);
    }).catch(error => serverError(next, error));
}

// update
export function updateAttributeType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeTypesModel.findById(req.params[idField])
        .then(value => {
            if (!value) {
                throw notFoundError;
            }
            let changed = false;
            if (value.name !== req.body[name]) {
                value.name = req.body[name];
                changed = true;
            }
            if (value.attributeGroup.toString() !== req.body[attributeGroupField]) {
                value.attributeGroup = req.body[attributeGroupField];
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
                socket.emit('attribute-types', 'update', at);
                res.json(at);
            }
        })
        .catch(error => serverError(next, error));
}

// delete
export function deleteAttributeType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeTypesModel.findById(req.params[idField])
        .then(attributeType => {
            if (!attributeType) {
                throw notFoundError;
            }
            return attributeType.remove();
        })
        .then(value => { // delete attributes in schema
            if (value) {
                const at = new AttributeType(value);
                socket.emit('attribute-types', 'delete', at);
                res.json(at);
            }
        })
        .catch(error => serverError(next, error));
}

export function canDeleteAttributeType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    configurationItemModel.find({attributes: [{attributeType: req.params[idField]}]}).estimatedDocumentCount()
        .then(docs => res.json(docs === 0))
        .catch(error => serverError(next, error));
}

export function convertAttributeTypeToItemType(req: Request, res: Response, next: NextFunction) { // tbd
}
