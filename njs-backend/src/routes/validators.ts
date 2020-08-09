import { Request } from 'express';
import { body, param, validationResult } from 'express-validator';
import { HttpError } from '../rest-api/httpError.model';
import { id, name, upperId, lowerId, connectionTypeId, validationExpression } from '../util/fields.constants';
import {
  invalidNumber,
  invalidIdInParams,
  invalidIdInBody,
  idMismatch,
  invalidUpperIdInParams,
  invalidLowerIdInParams,
  invalidConnectionType,
  invalidName,
  invalidRegex,
  noMatchForRegex
} from '../util/messages.constants';

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

export const idParamValidator = mongoIdParamValidator(id, invalidIdInParams);
export const idBodyValidator = mongoIdBodyValidator(id, invalidIdInBody);
export const idBodyAndParamValidator = param(id)
  .custom((value: string, { req }) => value === req.body[id].toString())
  .withMessage(idMismatch);

export const upperIdParamValidator = mongoIdParamValidator(upperId, invalidUpperIdInParams);
export const lowerIdParamValidator = mongoIdParamValidator(lowerId, invalidLowerIdInParams);
export const connectionTypeIdParamValidator = mongoIdParamValidator(connectionTypeId, invalidConnectionType);

export const nameBodyValidator = body(name, invalidName)
  .trim()
  .isLength({ min: 1 });

export const nameParamValidator = param(name, invalidName)
  .trim()
  .isLength({ min: 1 });

export const namedObjectUpdateValidators = [
  idParamValidator,
  idBodyValidator,
  idBodyAndParamValidator,
  nameBodyValidator,
];

export const validRegexValidator = body(validationExpression, invalidRegex)
  .trim()
  .isLength({ min: 4 })
  .custom((value: string) => {
    if (!value.startsWith('^') || !value.endsWith('$')) {
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
  return body(fieldName, noMatchForRegex).trim().custom(value => new RegExp(validationExpression).test(value));
}


//