import { Request, Response, NextFunction } from 'express';

import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import {
    columnsField,
    itemTypeIdField,
    rowsField,
    textField,
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
import { FullConfigurationItem } from '../../models/item-data/full/full-configuration-item.model';
import { createConnectionsForFullItem } from './connection.al';
import {
    configurationItemModelUpdate,
    configurationItemModelCreate,
    configurationItemModelFindAll,
    configurationItemModelFind,
    configurationItemModelFindSingle,
    configurationItemModelTakeResponsibility,
    configurationItemModelAbandonResponsibility,
    configurationItemModelFindOne,
    configurationItemModelGetProposals,
} from './configuration-item.al';
import {
    configurationItemModelDelete,
    modelAvailableItemsForConnectionRuleAndCount,
    modelGetAllowedLowerConfigurationItemsForRule,
    modelGetAllowedUpperConfigurationItemsForRule,
    modelFindAndReturnConnectionsToLower,
    modelFindAndReturnConnectionsToUpper,
    modelGetFullConfigurationItemsByIds,
} from './multi-model.al';
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
    const columns = req.body[columnsField] as ColumnMap;
    const rows = req.body[rowsField] as string[][];
    importDataTable(itemTypeId, columns, rows, req.authentication)
        .then(result => res.json(result))
        .catch(error => serverError(next, error));
}
