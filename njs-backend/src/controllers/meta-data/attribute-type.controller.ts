import { Request, Response, NextFunction } from 'express';

import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { serverError } from '../error.controller';
import socket from '../socket.controller';
import { idField, nameField, attributeGroupIdField, validationExpressionField } from '../../util/fields.constants';
import { attributeTypeCtx, createAction, updateAction, deleteAction } from '../../util/socket.constants';
import { HttpError } from '../../rest-api/httpError.model';
import {
    attributeTypeModelCreate,
    attributeTypeModelUpdate,
    attributeTypeModelDelete,
    attributeTypeModelCanDelete,
    attributeTypeModelFindAll,
    attributeTypeModelFind,
    attributeTypeModelFindSingle,
    attributeTypeModelGetAttributeTypesForItemType,
    attributeTypeModelCountAttributes,
} from '../../models/abstraction-layer/meta-data/attribute-type.al';
import { modelGetCorrespondingValuesOfType } from '../../models/abstraction-layer/item-data/multi-model.al';

// read
export const getAttributeTypes = (req: Request, res: Response, next: NextFunction) => {
    attributeTypeModelFindAll()
        .then((attributeTypes: AttributeType[]) => {
            return res.json(attributeTypes.map(at => at));
        })
        .catch((error: any) => serverError(next, error));
}

export const getAttributeTypesForAttributeGroup = (req: Request, res: Response, next: NextFunction) => {
    const attributeGroup = req.params[idField];
    attributeTypeModelFind({attributeGroup})
        .then((attributeTypes: AttributeType[]) => res.json(attributeTypes))
        .catch((error: any) => serverError(next, error));
}

export const getAttributeTypesForItemType = (req: Request, res: Response, next: NextFunction) => {
    attributeTypeModelGetAttributeTypesForItemType(req.params[idField])
        .then((attributeTypes: AttributeType[]) => res.json(attributeTypes))
        .catch((error: any) => serverError(next, error));
}

export const getCorrespondingAttributeTypes = (req: Request, res: Response, next: NextFunction) => {
    const attributeType = req.params[idField];
    modelGetCorrespondingValuesOfType(attributeType)
        .then((attributeTypes) => res.json(attributeTypes))
        .catch((error: any) => serverError(next, error));
}

export const getAttributeType = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[idField];
    attributeTypeModelFindSingle(id)
        .then((attributeType: AttributeType) => {
            res.json(attributeType);
        })
        .catch((error: any) => serverError(next, error));
}

export const countAttributesForAttributeType = (req: Request, res: Response, next: NextFunction) => {
    attributeTypeModelCountAttributes(req.params[idField])
        .then(count => res.json(count))
        .catch((error: any) => serverError(next, error));
}

// create
export const createAttributeType = (req: Request, res: Response, next: NextFunction) => {
    const name = req.body[nameField] as string;
    const attributeGroupId = req.body[attributeGroupIdField] as string;
    const validationExpression = req.body[validationExpressionField] as string;
    attributeTypeModelCreate( name, attributeGroupId, validationExpression)
        .then((attributeType: AttributeType) => {
            socket.emit(createAction, attributeTypeCtx, attributeType);
            res.status(201).json(attributeType);
        })
        .catch((error: any) => serverError(next, error));
}

// update
export const updateAttributeType = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[idField];
    const name = req.body[nameField] as string;
    const attributeGroupId = req.body[attributeGroupIdField] as string;
    const validationExpression = req.body[validationExpressionField] as string;
    attributeTypeModelUpdate(id, name, attributeGroupId, validationExpression)
        .then((attributeType: AttributeType) => {
            if (attributeType) {
                socket.emit(updateAction, attributeTypeCtx, attributeType);
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
export const deleteAttributeType = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[idField];
    attributeTypeModelDelete(id)
        .then((attributeType: AttributeType) => {
            if (attributeType) {
                socket.emit(deleteAction, attributeTypeCtx, attributeType);
                res.json(attributeType);
            }
        })
        .catch((error: any) => serverError(next, error));
}

export const canDeleteAttributeType = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[idField];
    attributeTypeModelCanDelete(id)
        .then((canDelete) => res.json(canDelete))
        .catch((error: any) => serverError(next, error));
}
