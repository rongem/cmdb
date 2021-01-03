import { Request, Response, NextFunction } from 'express';

import { attributeTypeModel, IAttributeType } from '../../models/mongoose/attribute-type.model';
import { configurationItemModel, IAttribute } from '../../models/mongoose/configuration-item.model';
import { IItemType, itemTypeModel } from '../../models/mongoose/item-type.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { serverError, notFoundError } from '../error.controller';
import socket from '../socket.controller';
import { idField, nameField, attributeGroupIdField, validationExpressionField, attributeGroupsField, attributeGroupField } from '../../util/fields.constants';
import { attributeTypeCat, createCtx, updateCtx, deleteCtx } from '../../util/socket.constants';
import { IAttributeGroup } from '../../models/mongoose/attribute-group.model';

// read
export function getAttributeTypes(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.find()
        .then((attributeTypes: IAttributeType[]) => {
            return res.json(attributeTypes.map(at => new AttributeType(at)));
        })
        .catch((error: any) => serverError(next, error));
}

export function getAttributeTypesForAttributeGroup(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.find({attributeGroup: req.params[idField]})
        .then((attributeTypes: IAttributeType[]) => res.json(attributeTypes.map(at => new AttributeType(at))))
        .catch((error: any) => serverError(next, error));
}

export function getAttributeTypesForItemType(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[idField])
        .then((itemType: IItemType) => {
            if (!itemType) {
                throw notFoundError;
            }
            return attributeTypeModel.find({attributeGroup: {$in: itemType.attributeGroups}}).sort(nameField);
        })
        .then((attributeTypes: IAttributeType[]) => res.json(attributeTypes.map(at => new AttributeType(at))))
        .catch((error: any) => serverError(next, error));
}

export function getCorrespondingAttributeTypes(req: Request, res: Response, next: NextFunction) {} // tbd

export function getAttributeType(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.findById(req.params[idField])
        .then((attributeType: IAttributeType) => {
            if (!attributeType) {
                throw notFoundError;
            }
            res.json(new AttributeType(attributeType));
        })
        .catch((error: any) => serverError(next, error));
}

export function countAttributesForAttributeType(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.findById(req.params[idField]).countDocuments()
        .then(async (typesCount: number) => {
            if (typesCount !== 1) {
                throw notFoundError;
            }
            const count = await configurationItemModel.find({'attributes.type': req.params[idField]}).countDocuments();
            res.json(count);
        })
        .catch((error: any) => serverError(next, error));
}

// create
export function createAttributeType(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.create({
        name: req.body[nameField],
        attributeGroup: req.body[attributeGroupIdField],
        validationExpression: req.body[validationExpressionField]
    }).then(attributeType => {
        const at = new AttributeType(attributeType);
        socket.emit(attributeTypeCat, createCtx, at);
        res.status(201).json(at);
    }).catch((error: any) => serverError(next, error));
}

// update
export function updateAttributeType(req: Request, res: Response, next: NextFunction) {
    const name = req.body[nameField] as string;
    const attributeGroupId = req.body[attributeGroupIdField] as string;
    const validationExpression = req.body[validationExpressionField] as string;
    attributeTypeModel.findById(req.params[idField])
        .then((attributeType: IAttributeType) => {
            if (!attributeType) {
                throw notFoundError;
            }
            let changed = false;
            if (attributeType.name !== name) {
                attributeType.name = name;
                changed = true;
            }
            const compareGroupId = attributeType.populated(attributeGroupField) ? (attributeType.attributeGroup as IAttributeGroup)._id.toString() :
                attributeType.attributeGroup.toString();
            if (compareGroupId !== attributeGroupId) {
                attributeType.attributeGroup = attributeGroupId;
                changed = true;
            }
            if (attributeType.validationExpression !== validationExpression) {
                attributeType.validationExpression = validationExpression;
                changed = true;
            }
            if (!changed) {
                res.sendStatus(304);
                return;
            }
            return attributeType.save();
        })
        .then((attributeType: IAttributeType) => {
            if (attributeType) {
                const at = new AttributeType(attributeType);
                socket.emit(attributeTypeCat, updateCtx, at);
                res.json(at);
            }
        })
        .catch((error: any) => serverError(next, error));
}

// delete
export function deleteAttributeType(req: Request, res: Response, next: NextFunction) {
    attributeTypeModel.findById(req.params[idField])
        .then((attributeType: IAttributeType) => {
            if (!attributeType) {
                throw notFoundError;
            }
            return attributeType.remove();
        })
        .then((attributeType: IAttributeType) => { // delete attributes in schema
            if (attributeType) {
                const at = new AttributeType(attributeType);
                socket.emit(attributeTypeCat, deleteCtx, at);
                res.json(at);
            }
        })
        .catch((error: any) => serverError(next, error));
}

export function canDeleteAttributeType(req: Request, res: Response, next: NextFunction) {
    configurationItemModel.find({attributes: [{attributeType: req.params[idField]} as unknown as IAttribute]}).countDocuments()
        .then((docs: number) => res.json(docs === 0))
        .catch((error: any) => serverError(next, error));
}
