import { body, param } from 'express-validator';

export const namedObjectValidator = [
    param('id').trim().isMongoId().withMessage('No valid id in path'),
    body('id').trim().isMongoId().withMessage('No valid id in body'),
    param('id').custom((value: string, {req}) => value === req.body.id.toString()).withMessage('Id in path is not equal to id in body'),
    body('name').trim().isLength({min: 1}).withMessage('Name must be at least one character long'),
]