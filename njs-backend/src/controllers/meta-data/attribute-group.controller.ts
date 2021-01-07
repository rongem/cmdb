import { Request, Response, NextFunction } from 'express';

import { attributeGroupModel, IAttributeGroup } from '../../models/mongoose/attribute-group.model';
import { attributeTypeModel } from '../../models/mongoose/attribute-type.model';
import { AttributeGroup } from '../../models/meta-data/attribute-group.model';
import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';
import { IItemType, itemTypeModel } from '../../models/mongoose/item-type.model';
import { idField, nameField } from '../../util/fields.constants';
import { disallowedDeletionOfAttributeGroupMsg } from '../../util/messages.constants';
import { attributeGroupCat, createCtx, updateCtx, deleteCtx } from '../../util/socket.constants';

// read
export function getAttributeGroups(req: Request, res: Response, next: NextFunction) {
    attributeGroupModel.find()
        .then((attributeGroups: IAttributeGroup[]) => res.json(attributeGroups.map(ag => new AttributeGroup(ag))))
        .catch((error: any) => serverError(next, error));
}

export function getAttributeGroupsInItemType(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[idField])
        .then((itemType: IItemType) => {
            if (!itemType) {
                throw notFoundError;
            }
            return attributeGroupModel.find({ _id: { $in: itemType.attributeGroups } });
        })
        .then((attributeGroups: IAttributeGroup[]) => res.json(attributeGroups.map(ag => new AttributeGroup(ag))))
        .catch((error: any) => serverError(next, error));
}

export function getAttributeGroupsNotInItemType(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[idField])
        .then((itemType: IItemType) => {
            if (!itemType) {
                throw notFoundError;
            }
            return attributeGroupModel.find({ _id: { $nin: itemType.attributeGroups } });
        })
        .then((attributeGroups: IAttributeGroup[]) => res.json(attributeGroups.map(ag => new AttributeGroup(ag))))
        .catch((error: any) => serverError(next, error));
}

export function getAttributeGroup(req: Request, res: Response, next: NextFunction) {
    attributeGroupModel.findById(req.params[idField])
        .then((attributeGroup: IAttributeGroup) => {
            if (!attributeGroup) {
                throw notFoundError;
            }
            return res.json(new AttributeGroup(attributeGroup));
        })
        .catch((error: any) => serverError(next, error));
}

// create
export function createAttributeGroup(req: Request, res: Response, next: NextFunction) {
    attributeGroupModel.create({ name: req.body[nameField] })
        .then(value => {
            const ag = new AttributeGroup(value);
            socket.emit(attributeGroupCat, createCtx, ag);
            return res.status(201).json(ag);
        })
        .catch((error: any) => serverError(next, error));
}

// update
export function updateAttributeGroup(req: Request, res: Response, next: NextFunction) {
    attributeGroupModel.findById(req.params[idField])
        .then((attributeGroup: IAttributeGroup) => {
            if (!attributeGroup) {
                throw notFoundError;
            }
            let changed = false;
            if (attributeGroup.name !== req.body[nameField]) {
                attributeGroup.name = req.body[nameField];
                changed = true;
            }
            if (!changed) {
                res.sendStatus(304);
                return;
            }
            return attributeGroup.save();
        })
        .then((attributeGroup: IAttributeGroup) => {
            if (attributeGroup) {
                const ag = new AttributeGroup(attributeGroup);
                socket.emit(attributeGroupCat, updateCtx, ag);
                res.json(ag);
            }
        })
        .catch((error: any) => serverError(next, error));
}

// delete
export function deleteAttributeGroup(req: Request, res: Response, next: NextFunction) {
    attributeGroupModel.findById(req.params[idField])
        .then(async (attributeGroup: IAttributeGroup) => {
            if (!attributeGroup) {
                throw notFoundError;
            }
            const attributeTypes = await attributeTypeModel.find({ attributeGroup: attributeGroup._id });
            if (attributeTypes && attributeTypes.length > 0) {
                throw new HttpError(422, disallowedDeletionOfAttributeGroupMsg);
            }
            return attributeGroup.remove();
        })
        .then((attributeGroup: IAttributeGroup) => {
            if (attributeGroup) {
                const ag = new AttributeGroup(attributeGroup);
                socket.emit(attributeGroupCat, deleteCtx, ag);
                res.json(ag);
            }
        })
        .catch((error: any) => serverError(next, error));
}

export function canDeleteAttributeGroup(req: Request, res: Response, next: NextFunction) {
    attributeGroupModel.findById(req.params[idField]).countDocuments()
        .then((attributeGroup: AttributeGroup) => {
            if (!attributeGroup) {
                throw notFoundError;
            }
            return attributeTypeModel.find({ attributeGroup: req.params[idField] }).countDocuments();
        })
        .then((attributeTypesCount: number) => res.json(attributeTypesCount === 0))
        .catch((error: any) => serverError(next, error));
}
