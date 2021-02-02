import { Request, Response, NextFunction } from 'express';

import { serverError, notFoundError } from '../error.controller';
import { HttpError } from '../../rest-api/httpError.model';
import {
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
import { handleFile } from './import.al';

export function uploadFile(req: Request, res: Response, next: NextFunction) {
    handleFile(req.file)
        .then(result => res.json(result))
        .catch(error => serverError(next, error));
}
