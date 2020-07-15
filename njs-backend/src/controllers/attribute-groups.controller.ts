import { Request, Response, NextFunction } from "express";
import attributeGroups from '../models/mongoose/attribute-group.model';

export function getAttributeGroups(req: Request, res: Response, next: NextFunction) {
    try {
        attributeGroups.find().then(attributeGroups => res.send(attributeGroups)).catch(err => console.log(err));
    } catch (ex) {
        console.log(ex);
    }
}
