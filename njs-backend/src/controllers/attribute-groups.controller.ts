import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import attributeGroups from '../models/mongoose/attribute-group.model';

export function getAttributeGroups(req: Request, res: Response, next: NextFunction) {
    try {
        attributeGroups.find().then(attributeGroups => res.status(200).send(attributeGroups)).catch(err => console.log(err));
    } catch (ex) {
        console.log(ex);
    }
}
