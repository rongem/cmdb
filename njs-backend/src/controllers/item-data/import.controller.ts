import { Request, Response, NextFunction } from 'express';

import { serverError} from '../error.controller';
import {
    columnsField,
    rowsField,
} from '../../util/fields.constants';
import { handleFile, importDataTable } from './import.al';
import { ColumnMap } from '../../models/item-data/column-map.model';
import { ItemType } from '../../models/meta-data/item-type.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';

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
    const connectionRules = req.connectionRules as unknown as ConnectionRule[];
    const columns = req.body[columnsField] as ColumnMap[];
    const rows = req.body[rowsField] as string[][];
    importDataTable(itemType, columns, rows, allowedAttributeTypes, connectionRules, req.authentication)
        .then(result => res.json(result))
        .catch(error => serverError(next, error));
}
