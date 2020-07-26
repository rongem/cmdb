import { Request } from 'express';
import { body, param, validationResult } from 'express-validator';
import { HttpError } from '../rest-api/httpError.model';

export const handleValidationErrors = (req: Request) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return;
  }
  const error = new HttpError(
    422,
    errors
      .array()
      .map((error) => error.param + ': ' + error.msg + ' (' + error.value + ').')
      .join('\n'),
    errors,
  );
  throw error;
};

export const idParamValidator = param('id').trim().isMongoId().withMessage('No valid id in path.');
export const idBodyValidator = body('id').trim().isMongoId().withMessage('No valid id in body.');

export const nameBodyValidator = body('name')
  .trim()
  .isLength({ min: 1 })
  .withMessage('Name must be at least one character long.');

export const nameParamValidator = param('name')
  .trim()
  .isLength({ min: 1 })
  .withMessage('Name must be at least one character long.');

export const namedObjectUpdateValidators = [
  idParamValidator,
  idBodyValidator,
  param('id').custom((value: string, { req }) => value === req.body.id.toString()).withMessage('Id in path is not equal to id in body.'),
  nameBodyValidator,
];

export const validRegexValidator = body('validationExpression', 'No valid regular expression.')
  .trim()
  .isLength({min: 4}).withMessage('Missing valid regular expression.')
  .custom((value: string) => {
    if(!value.startsWith('^') || !value.endsWith('$')) {
      return false;
    }
    try {
      new RegExp(value);
    } catch (error) {
      return false;
    }
    return true;
  }
);

export function validationExpressionValidator(fieldName: string, validationExpression: string) {
  return body(fieldName).trim().custom(value => new RegExp(validationExpression).test(value));
}

//