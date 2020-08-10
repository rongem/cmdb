import { Request, Response, NextFunction } from 'express';

import attributeGroups from '../../models/mongoose/attribute-group.model';
import attributeTypes from '../../models/mongoose/attribute-type.model';
import { AttributeGroup } from '../../models/meta-data/attribute-group.model';
import { handleValidationErrors } from '../../routes/validators';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';
import itemTypeModel from '../../models/mongoose/item-type.model';
import { idField, nameField } from '../../util/fields.constants';
import { disallowedDeletionOfAttributeGroupMsg } from '../../util/messages.constants';
import { attributeGroupCat, createCtx, updateCtx, deleteCtx } from '../../util/socket.constants';

//read
export function getAttributeGroups(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeGroups.find().sort(nameField)
        .then(attributeGroups => res.json(attributeGroups.map(ag => new AttributeGroup(ag))))
        .catch(error => serverError(next, error));
}

export function getAttributeGroupsInItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    itemTypeModel.findById(req.params[idField]).sort(nameField)
        .then(value => {
            if (!value) {
                throw notFoundError;
            }
            return attributeGroups.find({ _id: { $in: value.attributeGroups } })
        })
        .then(attributeGroups => res.json(attributeGroups.map(ag => new AttributeGroup(ag))))
        .catch(error => serverError(next, error))
}

export function getAttributeGroupsNotInItemType(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    itemTypeModel.findById(req.params[idField]).sort(nameField)
        .then(value => {
            if (!value) {
                throw notFoundError;
            }
            return attributeGroups.find({ _id: { $nin: value.attributeGroups } })
        })
        .then(attributeGroups => res.json(attributeGroups.map(ag => new AttributeGroup(ag))))
        .catch(error => serverError(next, error))
}

export function getAttributeGroup(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeGroups.findById(req.params[idField])
        .then(value => {
            if (!value) {
                throw notFoundError;
            }
            return res.json(new AttributeGroup(value));
        })
        .catch(error => serverError(next, error));
}

// create
export function createAttributeGroup(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeGroups.create({ name: req.body[nameField] })
        .then(value => {
            const ag = new AttributeGroup(value);
            socket.emit(attributeGroupCat, createCtx, ag);
            return res.status(201).json(ag);
        })
        .catch(error => serverError(next, error));
}

// update
export function updateAttributeGroup(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeGroups.findById(req.params[idField])
        .then(value => {
            if (!value) {
                throw notFoundError;
            }
            let changed = false;
            if (value.name !== req.body[nameField]) {
                value.name = req.body[nameField];
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
                const ag = new AttributeGroup(value);
                socket.emit(attributeGroupCat, updateCtx, ag);
                res.json(ag);
            }
        })
        .catch(error => serverError(next, error));
}

// delete
export function deleteAttributeGroup(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeGroups.findById(req.params[idField])
        .then(attributeGroup => {
            if (!attributeGroup) {
                throw notFoundError;
            }
            return attributeTypes.find({ attributeGroup: attributeGroup._id })
                .then(attributeTypes => {
                    if (attributeTypes && attributeTypes.length > 0) {
                        throw new HttpError(409, disallowedDeletionOfAttributeGroupMsg);
                    }
                    return attributeGroup.remove();
                });
        })
        .then(value => {
            if (value) {
                const ag = new AttributeGroup(value);
                socket.emit(attributeGroupCat, deleteCtx, ag);
                res.json(ag);
            }
        })
        .catch(error => serverError(next, error));
}

export function canDeleteAttributeGroup(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeGroups.findById(req.params[idField]).countDocuments()
        .then(value => {
            if (!value) {
                throw notFoundError;
            }
            return attributeTypes.find({ attributeGroup: req.params[idField] }).countDocuments();
        })
        .then(attributeTypesCount => res.json(attributeTypesCount === 0))
        .catch(error => serverError(next, error));
}
