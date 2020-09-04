import { Request, Response, NextFunction } from 'express';

import { attributeTypeModel } from '../../models/mongoose/attribute-type.model';
import { configurationItemModel, IAttribute } from '../../models/mongoose/configuration-item.model';
import { itemTypeModel } from '../../models/mongoose/item-type.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { serverError, notFoundError } from '../error.controller';
import socket from '../socket.controller';
import { idField, nameField, attributeGroupIdField, validationExpressionField } from '../../util/fields.constants';
import { attributeTypeCat, createCtx, updateCtx, deleteCtx } from '../../util/socket.constants';

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

export function convertAttributeTypeToItemType(req: Request, res: Response, next: NextFunction) { // tbd
}
