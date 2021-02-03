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

export function uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
        const result = handleFile(req.file);
        res.json(result);
    } catch (error) {
        serverError(next, error);
    }
}

export function importTable(req: Request, res: Response, next: NextFunction) {
    const itemTypeId = req.body[itemTypeIdField] as string;
    const columns = req.body[columnsField] as ColumnMap[];
    const rows = req.body[rowsField] as string[][];
    importDataTable(itemTypeId, columns, rows, req.authentication)
        .then(result => res.json(result))
        .catch(error => serverError(next, error));
}
