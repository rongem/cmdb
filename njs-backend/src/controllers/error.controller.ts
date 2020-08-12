import { Request, Response, NextFunction } from "express";

import { HttpError } from "../rest-api/httpError.model";
import { MongoError } from "mongodb";
import { noResourceWithThisIdMsg, duplicateObjectNameMsg } from "../util/messages.constants";

export function error404(req: Request, res: Response, next: NextFunction) {
    res.sendStatus(404);
}

export const notFoundError = new HttpError(404, noResourceWithThisIdMsg);

export function serverError(next: NextFunction, error: any) {
    if (!error) { console.log('should not be here'); return; }
    if (error instanceof HttpError) {
        next(error);
    } else if (error instanceof MongoError) {
        if (error.code === 11000) {
            next(new HttpError(422, duplicateObjectNameMsg));
        } else {
            console.log(error.code, error.message);
            next(new HttpError(400, error.message));
        }
    } else {
        next(new HttpError(500, error));
    }
}