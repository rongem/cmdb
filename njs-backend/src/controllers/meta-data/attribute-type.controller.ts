import { Request, Response, NextFunction } from 'express';

import { attributeTypeModel, IAttributeType, IAttributeTypePopulated } from '../../models/mongoose/attribute-type.model';
import { configurationItemModel, IAttribute } from '../../models/mongoose/configuration-item.model';
import { IItemType, itemTypeModel } from '../../models/mongoose/item-type.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { serverError, notFoundError } from '../error.controller';
import socket from '../socket.controller';
import { idField, nameField, attributeGroupIdField, validationExpressionField, attributeGroupsField, attributeGroupField } from '../../util/fields.constants';
import { attributeTypeCat, createCtx, updateCtx, deleteCtx } from '../../util/socket.constants';
import { IAttributeGroup } from '../../models/mongoose/attribute-group.model';
import { HttpError } from '../../rest-api/httpError.model';
import { disallowedDeletionOfAttributeTypeMsg, nothingChanged } from '../../util/messages.constants';

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
    const name = req.body[nameField] as string;
    const attributeGroupId = req.body[attributeGroupIdField] as string;
    const validationExpression = req.body[validationExpressionField] as string;
    attributeTypeModelCreate( name, attributeGroupId, validationExpression)
        .then((attributeType: AttributeType) => {
            socket.emit(attributeTypeCat, createCtx, attributeType);
            res.status(201).json(attributeType);
        })
        .catch((error: any) => serverError(next, error));
}

async function attributeTypeModelCreate(name: string, attributeGroup: string, validationExpression: string) {
    let attributeType = await attributeTypeModel.create({ name, attributeGroup, validationExpression});
    attributeType =  await attributeType.populate({path: attributeGroupField, select: nameField}).execPopulate();
    return new AttributeType(attributeType);
}

// update
export function updateAttributeType(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField];
    const name = req.body[nameField] as string;
    const attributeGroupId = req.body[attributeGroupIdField] as string;
    const validationExpression = req.body[validationExpressionField] as string;
    attributeTypeModelUpdate(id, name, attributeGroupId, validationExpression)
        .then((attributeType: AttributeType) => {
            if (attributeType) {
                socket.emit(attributeTypeCat, updateCtx, attributeType);
                res.json(attributeType);
            }
        })
        .catch((error: HttpError) => {
            if (error.httpStatusCode === 304) {
                res.sendStatus(304);
                return;
            }
            serverError(next, error);
        });
}

async function attributeTypeModelUpdate(id: string, name: string, attributeGroupId: string, validationExpression: string) {
    let attributeType: IAttributeTypePopulated = await attributeTypeModel.findById(id).populate({path: attributeGroupField, select: nameField});
    if (!attributeType) {
        throw notFoundError;
    }
    let changed = false;
    if (attributeType.name !== name) {
        attributeType.name = name;
        changed = true;
    }
    const compareGroupId = attributeType.attributeGroup._id.toString();
    if (compareGroupId !== attributeGroupId) {
        (attributeType as IAttributeType).attributeGroup = attributeGroupId;
        changed = true;
    }
    if (attributeType.validationExpression !== validationExpression) {
        attributeType.validationExpression = validationExpression;
        changed = true;
    }
    if (!changed) {
        throw new HttpError(304, nothingChanged);
    }
    attributeType = await attributeType.save();
    attributeType = await attributeType.populate({path: attributeGroupField, select: nameField}).execPopulate();
    return new AttributeType(attributeType);
}

// delete
export function deleteAttributeType(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField];
    attributeTypeModelDelete(id)
        .then((attributeType: AttributeType) => {
            if (attributeType) {
                socket.emit(attributeTypeCat, deleteCtx, attributeType);
                res.json(attributeType);
            }
        })
        .catch((error: any) => serverError(next, error));
}

async function attributeTypeModelDelete(id: string) {
    const canDelete = await attributeTypeModelCanDelete(id); // tbd: delete attributes in schema
    if (!canDelete) {
        throw new HttpError(422, disallowedDeletionOfAttributeTypeMsg);
    }
    let attributeType = await attributeTypeModel.findById(id);
    if (!attributeType) {
        throw notFoundError;
    }
    attributeType = await attributeType.remove();
    return new AttributeType(attributeType);
}

export function canDeleteAttributeType(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField];
    attributeTypeModelCanDelete(id)
        .then((canDelete) => res.json(canDelete))
        .catch((error: any) => serverError(next, error));
}

async function attributeTypeModelCanDelete(id: string) {
    const docs = await configurationItemModel.find({attributes: {$elemMatch: {type: id}}}).countDocuments();
    return docs === 0;
}
