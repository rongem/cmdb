import { Request, Response, NextFunction } from 'express';

import attributeTypesModel from '../../models/mongoose/attribute-type.model';
import configurationItemModel from '../../models/mongoose/configuration-item.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { handleValidationErrors } from '../../routes/validators';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';

// read
export function getAttributeTypes(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeTypesModel.find()
        .then(attributeTypes => res.json(attributeTypes.map(at => new AttributeType(at))))
        .catch(error => serverError(next, error));
}

export function getAttributeType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeTypesModel.findById(req.params.id)
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
        name: req.body.name,
        attributeGroup: req.body.attributeGroup,
        validationExpression: req.body.validationExpression
    }).then(value => {
        const at = new AttributeType(value);
        socket.emit('attribute-types', 'create', at);
        return res.status(201).json(at);
    }).catch(error => serverError(next, error));
}

// update
export function updateAttributeType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeTypesModel.findById(req.params.id)
        .then(value => {
            if (!value) {
                throw notFoundError;
            }
            let changed = false;
            if (value.name !== req.body.name) {
                value.name = req.body.name;
                changed = true;
            }
            if (value.attributeGroup.toString() !== req.body.attributeGroup) {
                value.attributeGroup = req.body.attributeGroup;
                changed = true;
            }
            if (value.validationExpression !== req.body.validationExpression) {
                value.validationExpression = req.body.validationExpression;
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
    attributeTypesModel.findById(req.params.id)
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
    configurationItemModel.find({attributes: {attributeType: req.params.id}}).estimatedDocumentCount()
        .then(docs => res.json(docs === 0))
        .catch(error => serverError(next, error));
}
