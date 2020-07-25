import { Request, Response, NextFunction } from 'express';

import attributeGroups from '../../models/mongoose/attribute-group.model';
import attributeTypes from '../../models/mongoose/attribute-type.model';
import { AttributeGroup } from '../../models/meta-data/attribute-group.model';
import { handleValidationErrors } from '../../routes/validators';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';

export function getAttributeGroups(req: Request, res: Response, next: NextFunction) {
    console.log(req.ntlm);
    handleValidationErrors(req);
    attributeGroups.find().then(attributeGroups => res.status(200).send(attributeGroups.map(ag => new AttributeGroup(ag)))).catch(err => console.log(err));
}

export function getAttributeGroup(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeGroups.findById(req.params.id)
        .then(value => {
            if (!value) {
                throw notFoundError;
            }
            return res.send(new AttributeGroup(value));
        })
        .catch(error => serverError(next, error));
}

export function createAttributeGroup(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeGroups.create({name: req.body.name})
        .then(value => {
            const ag = new AttributeGroup(value);
            socket.emit('attribute-groups', 'create', ag);
            return res.status(201).send(ag);
        })
        .catch(error => serverError(next, error));
}

export function updateAttributeGroup(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeGroups.findById(req.params.id)
        .then(value => {
            if (!value) {
                throw notFoundError;
            }
            let changed = false;
            if (value.name !== req.body.name) {
                value.name = req.body.name;
                changed = true;
            }
            if (!changed) {
                res.status(304);
                return;
            }
            return value.save();
        })
        .then(value => {
            if (value) {
                const ag = new AttributeGroup(value);
                socket.emit('attribute-groups', 'update', ag);
                res.send(ag);
            }
        })
        .catch(error => serverError(next, error));
}

export function deleteAttributeGroup(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeGroups.findById(req.params.id)
        .then(value => {
            if (!value) {
                throw notFoundError;
            }
            return attributeTypes.find({attributeGroup: value._id});
        })
        .then(attributeTypes => {
            if (attributeTypes && attributeTypes.length > 0)
            {
                throw new HttpError(409, 'Attribute group still needed by existing attribute types');
            }
            return attributeGroups.findByIdAndRemove(req.params.id);
        })
        .then(value => {
            if (value) {
                const ag = new AttributeGroup(value);
                socket.emit('attribute-groups', 'delete', ag);
                res.send(new AttributeGroup(value));
            }
        })
        .catch(error => serverError(next, error));
}

export function canDeleteAttributeGroup(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeGroups.exists({_id: req.params.id})
        .then(value => {
            if (!value) {
                throw notFoundError;
            }
            return attributeTypes.find({attributeGroup: req.params.id});
        })
        .then(attributeTypes => res.send(!(attributeTypes && attributeTypes.length > 0)))
        .catch(error => serverError(next, error));
}
