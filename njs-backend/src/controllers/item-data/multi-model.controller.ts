import { Request, Response, NextFunction } from 'express';

import { serverError } from '../error.controller';
import {
    idField,
    newItemTypeNameField,
    colorField,
    positionField,
    connectionTypeIdField,
} from '../../util/fields.constants';
import socket from '../socket.controller';
import {
    allCtx,
    updateManyAction
} from '../../util/socket.constants';
import { modelConvertAttributeTypeToItemType } from '../../models/abstraction-layer/item-data/multi-model.al';
import { aboveValue } from '../../util/values.constants';

export const convertAttributeTypeToItemType = (req: Request, res: Response, next: NextFunction) => {
    const newItemTypeName = req.body[newItemTypeNameField] as string;
    const id = req.params[idField];
    const color = req.body[colorField];
    const connectionTypeId = req.body[connectionTypeIdField];
    const attributeType = req.attributeType;
    const attributeTypes = req.attributeTypes ?? [];
    const newItemIsUpperType = req.body[positionField] === aboveValue;
    modelConvertAttributeTypeToItemType(id, newItemTypeName, attributeType, attributeTypes, connectionTypeId, color,
        newItemIsUpperType, req.authentication)
        .then(result => {
            socket.emit(updateManyAction, allCtx, result);
            res.json(result);
        })
        .catch(error => serverError(next, error));
}

