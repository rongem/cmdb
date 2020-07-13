import { Request, Response, NextFunction } from "express";
import { getDb } from "../util/database";

export function getAttributeGroups(req: Request, res: Response, next: NextFunction) {
    try {
        const db = getDb();
        db.collection('attributeGroups').find().toArray().then(result => res.send(result)).catch(err => console.log(err));
    } catch (ex) {
        console.log(ex);
    }
}
