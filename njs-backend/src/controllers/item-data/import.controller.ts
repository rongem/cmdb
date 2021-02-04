import { Request, Response, NextFunction } from 'express';

import { serverError} from '../error.controller';
import {
    columnsField,
    itemTypeIdField,
    rowsField,
} from '../../util/fields.constants';
import {
    configurationItemCtx,
    connectionCtx,
    createAction,
    updateAction,
    deleteAction,
    deleteManyAction,
    createManyAction
} from '../../util/socket.constants';
import socket from '../socket.controller';
import { handleFile, importDataTable } from './import.al';
import { ColumnMap } from '../../models/item-data/column-map.model';
import { ItemType } from '../../models/meta-data/item-type.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';

export function uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
        const result = handleFile(req.file);
        res.json(result);
    } catch (error) {
        serverError(next, error);
    }
}

export function importTable(req: Request, res: Response, next: NextFunction) {
    const itemType = new ItemType(req.itemType);
    const allowedAttributeTypes = req.attributeTypes as unknown as AttributeType[];
    const columns = req.body[columnsField] as ColumnMap[];
    const rows = req.body[rowsField] as string[][];
    importDataTable(itemType, columns, rows, allowedAttributeTypes, req.authentication)
        .then(result => res.json(result))
        .catch(error => serverError(next, error));
}
