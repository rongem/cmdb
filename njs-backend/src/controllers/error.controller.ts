import { Request, Response, NextFunction } from "express";

import { HttpError } from "../rest-api/httpError.model";
import { MongoError } from "mongodb";

export function error404(req: Request, res: Response, next: NextFunction) {
    res.sendStatus(404);
}

export const notFoundError = new HttpError(404, 'No resource matches this id');

export function serverError(next: NextFunction, error: any) {
    if (error instanceof HttpError) {
        next(error);
    } else if (error instanceof MongoError) {
        if (error.code === 110001) {
            next(new HttpError(422, 'Object with this name already exists. No duplicates allowed.'));
        } else {
            console.log(error.code, error.message);
            next(new HttpError(400, error.message));
        }
    } else {
        next(new HttpError(500, error));
    }
}