import { Request, Response, NextFunction } from 'express';

import { AttributeGroup } from '../../models/meta-data/attribute-group.model';
import { serverError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import socket from '../socket.controller';
import { idField, nameField } from '../../util/fields.constants';
import { attributeGroupCat, createCtx, updateCtx, deleteCtx } from '../../util/socket.constants';
import {
    attributeGroupModelCanDelete,
    attributeGroupModelCreate,
    attributeGroupModelDelete,
    attributeGroupModelFindAll,
    attributeGroupModelFindSingle,
    attributeGroupModelUpdate,
    attributeGroupsModelGetAttributeGroupsInItemType,
    attributeGroupsModelGetAttributeGroupsNotInItemType,
} from './attribute-group.al';

// read
export function getAttributeGroups(req: Request, res: Response, next: NextFunction) {
    attributeGroupModelFindAll()
        .then((attributeGroups: AttributeGroup[]) => res.json(attributeGroups))
        .catch((error: any) => serverError(next, error));
}

export function getAttributeGroupsInItemType(req: Request, res: Response, next: NextFunction) {
    attributeGroupsModelGetAttributeGroupsInItemType(req.params[idField])
        .then(attributeGroups => res.json(attributeGroups))
        .catch((error: any) => serverError(next, error));
}

export function getAttributeGroupsNotInItemType(req: Request, res: Response, next: NextFunction) {
    attributeGroupsModelGetAttributeGroupsNotInItemType(req.params[idField])
        .then(attributeGroups => res.json(attributeGroups))
        .catch((error: any) => serverError(next, error));
}

export function getAttributeGroup(req: Request, res: Response, next: NextFunction) {
    attributeGroupModelFindSingle(req.params[idField])
        .then((attributeGroup: AttributeGroup) => res.json(attributeGroup))
        .catch((error: any) => serverError(next, error));
}

// create
export function createAttributeGroup(req: Request, res: Response, next: NextFunction) {
    const name = req.body[nameField] as string;
    attributeGroupModelCreate(name)
        .then(attributeGroup => {
            socket.emit(attributeGroupCat, createCtx, attributeGroup);
            return res.status(201).json(attributeGroup);
        })
        .catch((error: any) => serverError(next, error));
}

// update
export function updateAttributeGroup(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField];
    const name = req.body[nameField];
    attributeGroupModelUpdate(id, name)
        .then((attributeGroup: AttributeGroup) => {
            if (attributeGroup) {
                socket.emit(attributeGroupCat, updateCtx, attributeGroup);
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
export function deleteAttributeGroup(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField];
    attributeGroupModelDelete(id)
        .then((attributeGroup) => {
            if (attributeGroup) {
                socket.emit(attributeGroupCat, deleteCtx, attributeGroup);
                res.json(attributeGroup);
            }
        })
        .catch((error: any) => serverError(next, error));
}

export function canDeleteAttributeGroup(req: Request, res: Response, next: NextFunction) {
    attributeGroupModelCanDelete(req.params[idField])
        .then(result => res.json(result))
        .catch((error: any) => serverError(next, error));
}
