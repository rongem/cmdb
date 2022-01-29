import { Request, Response, NextFunction } from 'express';

import { HttpError } from '../rest-api/httpError.model';
import { MongoServerError } from 'mongodb';
import { noResourceWithThisIdMsg, duplicateObjectNameMsg } from '../util/messages.constants';

export const error404 = (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(404);
}

export const notFoundError = new HttpError(404, noResourceWithThisIdMsg);

export const serverError = (next: NextFunction, error: any) => {
    if (!error) { console.log('should not be here'); return; }
    if (error instanceof HttpError) {
        next(error);
    } else if (error instanceof MongoServerError) {
        if (error.code === 11000) {
            next(new HttpError(400, duplicateObjectNameMsg));
        } else {
            console.log(error.code, error.message);
            next(new HttpError(400, error.message));
        }
    } else {
        next(new HttpError(500, error));
    }
}
