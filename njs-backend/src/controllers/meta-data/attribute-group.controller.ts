import { Request, Response, NextFunction } from 'express';

import { AttributeGroup } from '../../models/meta-data/attribute-group.model';
import { serverError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';
import { idField, nameField } from '../../util/fields.constants';
import { attributeGroupCtx, createAction, updateAction, deleteAction } from '../../util/socket.constants';
import {
    attributeGroupModelCanDelete,
    attributeGroupModelCreate,
    attributeGroupModelDelete,
    attributeGroupModelFindAll,
    attributeGroupModelFindSingle,
    attributeGroupModelUpdate,
    attributeGroupsModelGetAttributeGroupsInItemType,
    attributeGroupsModelGetAttributeGroupsNotInItemType,
} from '../../models/abstraction-layer/meta-data/attribute-group.al';

// read
export const getAttributeGroups = (req: Request, res: Response, next: NextFunction) => {
    attributeGroupModelFindAll()
        .then((attributeGroups: AttributeGroup[]) => res.json(attributeGroups))
        .catch((error: any) => serverError(next, error));
}

export const getAttributeGroupsInItemType = (req: Request, res: Response, next: NextFunction) => {
    attributeGroupsModelGetAttributeGroupsInItemType(req.params[idField])
        .then(attributeGroups => res.json(attributeGroups))
        .catch((error: any) => serverError(next, error));
}

export const getAttributeGroupsNotInItemType = (req: Request, res: Response, next: NextFunction) => {
    attributeGroupsModelGetAttributeGroupsNotInItemType(req.params[idField])
        .then(attributeGroups => res.json(attributeGroups))
        .catch((error: any) => serverError(next, error));
}

export const getAttributeGroup = (req: Request, res: Response, next: NextFunction) => {
    attributeGroupModelFindSingle(req.params[idField])
        .then((attributeGroup: AttributeGroup) => res.json(attributeGroup))
        .catch((error: any) => serverError(next, error));
}

// create
export const createAttributeGroup = (req: Request, res: Response, next: NextFunction) => {
    const name = req.body[nameField] as string;
    attributeGroupModelCreate(name)
        .then(attributeGroup => {
            socket.emit(createAction, attributeGroupCtx, attributeGroup);
            return res.status(201).json(attributeGroup);
        })
        .catch((error: any) => serverError(next, error));
}

// update
export const updateAttributeGroup = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[idField];
    const name = req.body[nameField];
    attributeGroupModelUpdate(id, name)
        .then((attributeGroup: AttributeGroup) => {
            if (attributeGroup) {
                socket.emit(updateAction, attributeGroupCtx, attributeGroup);
                res.json(attributeGroup);
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
export const deleteAttributeGroup = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[idField];
    attributeGroupModelDelete(id)
        .then((attributeGroup) => {
            if (attributeGroup) {
                socket.emit(deleteAction, attributeGroupCtx, attributeGroup);
                res.json(attributeGroup);
            }
        })
        .catch((error: any) => serverError(next, error));
}

export const canDeleteAttributeGroup = (req: Request, res: Response, next: NextFunction) => {
    attributeGroupModelCanDelete(req.params[idField])
        .then(result => res.json(result))
        .catch((error: any) => serverError(next, error));
}
