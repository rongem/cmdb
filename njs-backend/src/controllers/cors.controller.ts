import { Request, Response, NextFunction } from "express";
import fs from 'fs';

export function preventCORSError(req: Request, res: Response, next: NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === "OPTIONS") {
        res.end();
    } else {
        next();
    }
}