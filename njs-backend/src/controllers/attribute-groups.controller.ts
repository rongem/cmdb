import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import attributeGroups from '../models/mongoose/attribute-group.model';
import { AttributeGroup } from '../models/meta-data/attribute-group.model';

export function getAttributeGroups(req: Request, res: Response, next: NextFunction) {
    try {
        attributeGroups.find().then(attributeGroups => res.status(200).send(attributeGroups.map(ag => new AttributeGroup(ag)))).catch(err => console.log(err));
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export function createAttributeGroup(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    console.log(errors);
    try {
        attributeGroups.create({name: 'Test'});
        res.status(201).json({result: true});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export function updateAttributeGroup(req: Request, res: Response, next: NextFunction) {
    try {
        const errors = validationResult(req);
        console.log(errors);
        res.status(200).json({result: !errors.isEmpty()});
    } catch (error) {
        next(error);
    }
}
