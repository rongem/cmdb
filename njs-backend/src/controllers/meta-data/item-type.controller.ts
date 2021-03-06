import { Request, Response, NextFunction } from 'express';

import { ItemType } from '../../models/meta-data/item-type.model';
import { ItemTypeAttributeGroupMapping } from '../../models/meta-data/item-type-attribute-group-mapping.model';
import { serverError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import {
    idField,
    nameField,
    itemTypeIdField,
    attributeGroupIdField,
    attributeGroupsField,
    colorField,
    connectionTypeField,
} from '../../util/fields.constants';
import {
    disallowedDeletionOfMappingMsg,
} from '../../util/messages.constants';
import { itemTypeCtx, createAction, updateAction, deleteAction } from '../../util/socket.constants';
import socket from '../socket.controller';
import {
    itemTypeModelCountAttributesForMapping,
    itemTypeModelCanDelete,
    itemTypeModelCreate,
    itemTypeModelDelete,
    itemTypeModelFindAll,
    itemTypeModelFindSingle,
    itemTypeModelUpdate,
    itemTypeModelGetAllMappings,
    itemTypeModelGetItemTypesForUpperItemTypeAndConnection,
    itemTypeModelGetItemTypesForLowerItemTypeAndConnection,
    itemTypeModelGetItemTypesByAllowedAttributeType,
} from './item-type.al';
import { IItemType } from '../../models/mongoose/item-type.model';

// Read
export function getItemTypes(req: Request, res: Response, next: NextFunction) {
    itemTypeModelFindAll()
        .then((itemTypes: ItemType[]) => res.json(itemTypes))
        .catch((error: any) => serverError(next, error));
}

export function getItemTypesForUpperItemTypeAndConnection(req: Request, res: Response, next: NextFunction) {
    const itemId = req.params[idField];
    const connectionTypeId = req.params[connectionTypeField];
    itemTypeModelGetItemTypesForUpperItemTypeAndConnection(itemId, connectionTypeId)
        .then(itemTypes => res.json(itemTypes))
        .catch((error: any) => serverError(next, error));
}

export function getItemTypesForLowerItemTypeAndConnection(req: Request, res: Response, next: NextFunction) {
    const itemId = req.params[idField];
    const connectionTypeId = req.params[connectionTypeField];
    itemTypeModelGetItemTypesForLowerItemTypeAndConnection(itemId, connectionTypeId)
        .then(itemTypes => res.json(itemTypes))
        .catch((error: any) => serverError(next, error));
}

export function getItemTypesByAllowedAttributeType(req: Request, res: Response, next: NextFunction) {
    const attributeTypeId = req.params[idField];
    itemTypeModelGetItemTypesByAllowedAttributeType(attributeTypeId)
        .then(itemTypes => res.json(itemTypes))
        .catch((error: any) => serverError(next, error));
}

export function getItemTypeAttributeMappings(req: Request, res: Response, next: NextFunction) {
    itemTypeModelGetAllMappings()
        .then(mappings => res.json(mappings))
        .catch((error: any) => serverError(next, error));
}

export function getItemType(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField];
    itemTypeModelFindSingle(id)
        .then((itemType: ItemType) => res.json(itemType))
        .catch((error: any) => serverError(next, error));
}

export async function countAttributesForItemTypeAttributeMapping(req: Request, res: Response, next: NextFunction) {
    try {
        const count = await itemTypeModelCountAttributesForMapping(req.params[attributeGroupIdField], req.itemType.id);
        res.json(count);
    }
    catch (error) {
        serverError(next, error);
    }
}

// Create
export function createItemType(req: Request, res: Response, next: NextFunction) {
    const name = req.body[nameField] as string;
    const color = req.body[colorField] as string;
    const attributeGroups = (req.body[attributeGroupsField] as {[idField]: string}[] ?? []).map(ag => ag[idField]);
    itemTypeModelCreate(name, color, attributeGroups).then(itemType => {
        socket.emit(createAction, itemTypeCtx, itemType);
        res.status(201).json(itemType);
    }).catch((error: any) => serverError(next, error));
}

export function createItemTypeAttributeGroupMapping(req: Request, res: Response, next: NextFunction) {
    req.itemType.attributeGroups.push(req.body[attributeGroupIdField]);
    return req.itemType.save()
        .then((itemType: IItemType) => {
            const m = new ItemTypeAttributeGroupMapping();
            m.itemTypeId = req.body[itemTypeIdField];
            m.attributeGroupId = req.body[attributeGroupIdField];
            socket.emit(updateAction, itemTypeCtx, new ItemType(itemType));
            return res.json(m);
        })
        .catch((error: any) => serverError(next, error));
}

// Update
export function updateItemType(req: Request, res: Response, next: NextFunction) {
    const id = req.params[idField] as string;
    const name = req.body[nameField] as string;
    const color = req.body[colorField] as string;
    const attributeGroups = (req.body[attributeGroupsField] as {[idField]: string}[] ?? []).map(a => a[idField]);
    itemTypeModelUpdate(id, name, color, attributeGroups)
        .then((itemType: ItemType) => {
            if (itemType) {
                socket.emit(updateAction, itemTypeCtx, itemType);
                return res.json(itemType);
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

// Delete
export function deleteItemType(req: Request, res: Response, next: NextFunction) {
    const itemId = req.params[idField] as string;
    itemTypeModelDelete(itemId)
        .then((itemType: ItemType) => {
            socket.emit(updateAction, itemTypeCtx, itemType);
            return res.json(itemType);
        })
        .catch((error: any) => serverError(next, error));
}

export async function deleteItemTypeAttributeGroupMapping(req: Request, res: Response, next: NextFunction) {
    try {
        const count = await itemTypeModelCountAttributesForMapping(req.params[attributeGroupIdField], req.itemType.id);
        if (count > 0) {
            throw new Error(disallowedDeletionOfMappingMsg);
        }
        req.itemType.attributeGroups.splice(req.itemType.attributeGroups.map((g: any) => g.toString()).indexOf(req.params[attributeGroupIdField]), 1);
        const itemType = await req.itemType.save();
        const m = new ItemTypeAttributeGroupMapping();
        m.itemTypeId = itemType.id;
        m.attributeGroupId = req.params[attributeGroupIdField];
        socket.emit(deleteAction, itemTypeCtx, new ItemType(itemType));
        res.json(m);
    }
    catch (error) {
        serverError(next, error);
    }
}

export function canDeleteItemType(req: Request, res: Response, next: NextFunction) {
    const itemId = req.params[idField] as string;
    itemTypeModelCanDelete(itemId).then(candelete => {
        res.json(candelete);
    }).catch(error => serverError(next, error));
}

export async function canDeleteItemTypeAttributeGroupMapping(req: Request, res: Response, next: NextFunction) {
    try {
        const count = await itemTypeModelCountAttributesForMapping(req.params[attributeGroupIdField], req.itemType.id);
        res.json(count === 0);
    }
    catch (error) {
        serverError(next, error);
    }
}
