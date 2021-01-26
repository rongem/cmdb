import { Request, Response, NextFunction } from 'express';

import { MetaData } from '../../models/meta-data/meta-data.model';
import { serverError } from '../error.controller';
import { modelGetMetaData } from './meta-data.al';

// read
export function getMetaData(req: Request, res: Response, next: NextFunction) {
    let userRole: number;
    let userName: string;
    if (req.authentication) {
        userRole = req.authentication.role;
        userName = req.authentication.name;
    } else if (req.userName){
        userRole = 0;
        userName = req.userName;
    }
    modelGetMetaData()
        .then(result => {
            const meta: MetaData = {
                ...result,
                userRole,
                userName,
            };
            res.json(meta);
        })
        .catch((error: any) => serverError(next, error));
}

