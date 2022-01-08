import { Request, Response, NextFunction } from 'express';

import { MetaData } from '../../models/meta-data/meta-data.model';
import { serverError } from '../error.controller';
import { modelGetMetaData } from '../../models/abstraction-layer/meta-data/meta-data.al';

// read
export const getMetaData = (req: Request, res: Response, next: NextFunction) => {
    let userRole: number;
    let userName: string;
    if (req.authentication) {
        userRole = req.authentication.role;
        userName = req.authentication.accountName;
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

