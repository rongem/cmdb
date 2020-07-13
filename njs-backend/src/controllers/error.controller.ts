import { Request, Response, NextFunction } from "express";

export function error404(req: Request, res: Response, next: NextFunction) {
    res.sendStatus(404);
}