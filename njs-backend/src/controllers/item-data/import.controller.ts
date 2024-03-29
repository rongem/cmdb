import { Request, Response, NextFunction } from 'express';

import { serverError} from '../error.controller';
import {
    columnsField,
    rowsField,
} from '../../util/fields.constants';
import { handleFile, importDataTable } from '../../models/abstraction-layer/item-data/import.al';
import { ColumnMap } from '../../models/item-data/column-map.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { HttpError } from '../../rest-api/httpError.model';
import { noFileMsg } from '../../util/messages.constants';

export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw new HttpError(400, noFileMsg);
        }
        const result = handleFile(req.file);
        res.json(result);
    } catch (error) {
        serverError(next, error);
    }
}

export const importTable = (req: Request, res: Response, next: NextFunction) => {
    const itemType = req.itemType;
    const allowedAttributeTypes = req.attributeTypes as unknown as AttributeType[];
    const connectionRules = req.connectionRules as unknown as ConnectionRule[];
    const columns = req.body[columnsField] as ColumnMap[];
    const rows = req.body[rowsField] as string[][];
    importDataTable(itemType, columns, rows, allowedAttributeTypes, connectionRules, req.authentication)
        .then(result => res.json(result))
        .catch(error => serverError(next, error));
}
