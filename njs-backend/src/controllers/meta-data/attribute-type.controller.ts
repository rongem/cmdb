import { Request, Response, NextFunction } from 'express';

import { attributeTypeModel } from '../../models/mongoose/attribute-type.model';
import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { IItemType, itemTypeModel } from '../../models/mongoose/item-type.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { serverError, notFoundError } from '../error.controller';
import socket from '../socket.controller';
import { idField, nameField, attributeGroupIdField, validationExpressionField } from '../../util/fields.constants';
import { attributeTypeCat, createCtx, updateCtx, deleteCtx } from '../../util/socket.constants';
import { HttpError } from '../../rest-api/httpError.model';
import {
    attributeTypeModelCreate,
    attributeTypeModelUpdate,
    attributeTypeModelDelete,
    attributeTypeModelCanDelete,
    attributeTypeModelFindAll,
    attributeTypeModelFind,
    attributeTypeModelFindSingle,
} from './attribute-type.al';

// read
export function getAttributeTypes(req: Request, res: Response, next: NextFunction) {
    attributeTypeModelFindAll()
        .then((attributeTypes: AttributeType[]) => {
            return res.json(attributeTypes.map(at => at));
        })
        .catch((error: any) => serverError(next, error));
}

export function getAttributeTypesForAttributeGroup(req: Request, res: Response, next: NextFunction) {
    const attributeGroup = req.params[idField];
    attributeTypeModelFind({attributeGroup})
        .then((attributeTypes: AttributeType[]) => res.json(attributeTypes))
        .catch((error: any) => serverError(next, error));
}

export function getAttributeTypesForItemType(req: Request, res: Response, next: NextFunction) {
    itemTypeModel.findById(req.params[idField])
        .then((itemType: IItemType) => {
            if (!itemType) {
                throw notFoundError;
            }
            return attributeTypeModelFind({attributeGroup: {$in: itemType.attributeGroups}});
        })
        .then((attributeTypes: AttributeType[]) => res.json(attributeTypes))
        .catch((error: any) => serverError(next, error));
}

export function getCorrespondingAttributeTypes() {} // tbd

export function getAttributeType(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField];
    attributeTypeModelFindSingle(id)
        .then((attributeType: AttributeType) => {
            res.json(attributeType);
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

export function canDeleteAttributeType(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField];
    attributeTypeModelCanDelete(id)
        .then((canDelete) => res.json(canDelete))
        .catch((error: any) => serverError(next, error));
}
