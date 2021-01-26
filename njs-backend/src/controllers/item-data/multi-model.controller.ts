import { Request, Response, NextFunction } from 'express';

import { serverError } from '../error.controller';
import {
    idField,
    newItemTypeNameField,
    colorField,
    positionField,
    connectionTypeField,
} from '../../util/fields.constants';
import socket from '../socket.controller';
import {
    allCtx,
    updateManyAction
} from '../../util/socket.constants';
import { modelConvertAttributeTypeToItemType } from './multi-model.al';

export function convertAttributeTypeToItemType(req: Request, res: Response, next: NextFunction) {
    const attributeGroup = req.attributeType.attributeGroup;
    const newItemTypeName = req.body[newItemTypeNameField] as string;
    const id = req.body[idField] as string;
    const color = req.body[colorField];
    const connectionTypeId = req.body[connectionTypeField];
    const attributeType = req.attributeType;
    const attributeTypes = req.attributeTypes;
    const newItemIsUpperType = req.body[positionField] === 'above';
    modelConvertAttributeTypeToItemType(id, newItemTypeName, attributeType, attributeTypes, attributeGroup, connectionTypeId, color,
        newItemIsUpperType, req.authentication)
        .then(result => {
            socket.emit(updateManyAction, allCtx, result);
            res.json(result);
        })
        .catch(error => serverError(next, error));
}

