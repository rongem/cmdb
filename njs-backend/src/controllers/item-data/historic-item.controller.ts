import { Request, Response, NextFunction } from 'express';
import {
    idField,
} from '../../util/fields.constants';
import { serverError } from '../error.controller';
import { historicCiModelFindById } from '../../models/abstraction-layer/item-data/historic-item.al';

export const getItemHistory = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[idField];
    historicCiModelFindById(id)
        .then(result => res.json(result))
        .catch((error: any) => serverError(next, error));
}
