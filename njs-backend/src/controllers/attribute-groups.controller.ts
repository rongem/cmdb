import { Request, Response, NextFunction } from 'express';
import attributeGroups from '../models/mongoose/attribute-group.model';
import { AttributeGroup } from '../models/meta-data/attribute-group.model';
import { handleValidationErrors } from '../routes/validators';

export function getAttributeGroups(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeGroups.find().then(attributeGroups => res.status(200).send(attributeGroups.map(ag => new AttributeGroup(ag)))).catch(err => console.log(err));
}

export function createAttributeGroup(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    attributeGroups.create({name: 'Test'});
    res.status(201).json({result: true});
}

export function updateAttributeGroup(req: Request, res: Response, next: NextFunction) {
    if (req.file) {
        console.log('file accepted');
        console.log(req.file);
    } else {
        console.log('no file');
    }
    handleValidationErrors(req);
    res.status(200).json({result: true});
}
