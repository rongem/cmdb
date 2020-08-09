import { Request } from 'express';
import { body, param, validationResult } from 'express-validator';
import { HttpError } from '../rest-api/httpError.model';
import { id, name, upperId, lowerId, connectionTypeId, validationExpression } from '../util/fields.constants';
import { invalidNumber } from '../util/messages.constants';

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

export const mongoIdBodyValidator = (fieldName: string, message: string) => body(fieldName, message).trim().isLowercase().isMongoId();
export const mongoIdParamValidator = (fieldName: string, message: string) => param(fieldName, message).trim().isLowercase().isMongoId();

export const rangedNumberBodyValidator = (fieldName: string) => body(fieldName, invalidNumber)
  .trim()
  .isNumeric()
  .custom((input: number) => input > 0 && input < 10000);

export const idParamValidator = mongoIdParamValidator(id, 'No valid id in path.');
export const idBodyValidator = mongoIdBodyValidator(id, 'No valid id in body.');
export const idBodyAndParamValidator = param(id)
  .custom((value: string, { req }) => value === req.body[id].toString())
  .withMessage('Id in path is not equal to id in body.');

export const upperIdParamValidator = mongoIdParamValidator(upperId, 'No valid upper id in path.');
export const lowerIdParamValidator = mongoIdParamValidator(lowerId, 'No valid lower id in path.');
export const connectionTypeIdParamValidator = mongoIdParamValidator(connectionTypeId, 'No valid connection type id in path.');

export const nameBodyValidator = body(name)
  .trim()
  .isLength({ min: 1 })
  .withMessage('Name must be at least one character long.');

export const nameParamValidator = param(name)
  .trim()
  .isLength({ min: 1 })
  .withMessage('Name must be at least one character long.');

export const namedObjectUpdateValidators = [
  idParamValidator,
  idBodyValidator,
  idBodyAndParamValidator,
  nameBodyValidator,
];

export const validRegexValidator = body(validationExpression, 'No valid regular expression.')
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
  return body(fieldName, 'Value did not match regular expresseion.').trim().custom(value => new RegExp(validationExpression).test(value));
}


//