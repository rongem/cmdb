import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult, check } from 'express-validator';

import { HttpError } from '../rest-api/httpError.model';
import {
  idField,
  nameField,
  upperIdField,
  lowerIdField,
  connectionTypeIdField,
  validationExpressionField,
  pageField,
} from '../util/fields.constants';
import {
  invalidNumberMsg,
  invalidIdInParamsMsg,
  invalidIdInBodyMsg,
  idMismatchMsg,
  invalidUpperIdInParamsMsg,
  invalidLowerIdInParamsMsg,
  invalidConnectionTypeMsg,
  invalidNameMsg,
  invalidRegexMsg,
  noMatchForRegexMsg,
  validationErrorsMsg,
  invalidPageMsg,
} from '../util/messages.constants';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return next(new HttpError(422, validationErrorsMsg, errors));
};

export const mongoIdBodyValidator = (fieldName: string, message: string) => body(fieldName, message).trim().isLowercase().isMongoId();
export const mongoIdParamValidator = (fieldName: string, message: string) => param(fieldName, message).trim().isLowercase().isMongoId();

export const rangedNumberBodyValidator = (fieldName: string) => body(fieldName, invalidNumberMsg)
  .trim()
  .isNumeric()
  .custom((input: number) => input > 0 && input < 10000);

export const stringExistsBodyValidator = (fieldName: string, message: string) => body(fieldName, message).trim().isLength({ min: 1 });
export const stringExistsParamValidator = (fieldName: string, message: string) => param(fieldName, message).trim().isLength({ min: 1 });

export const idParamValidator = mongoIdParamValidator(idField, invalidIdInParamsMsg);
export const idBodyValidator = mongoIdBodyValidator(idField, invalidIdInBodyMsg);
export const idBodyAndParamValidator = param(idField)
  .custom((value: string, { req }) => value === req.body[idField].toString())
  .withMessage(idMismatchMsg);

export const upperIdParamValidator = mongoIdParamValidator(upperIdField, invalidUpperIdInParamsMsg);
export const lowerIdParamValidator = mongoIdParamValidator(lowerIdField, invalidLowerIdInParamsMsg);
export const connectionTypeIdParamValidator = mongoIdParamValidator(connectionTypeIdField, invalidConnectionTypeMsg);

export const nameBodyValidator = stringExistsBodyValidator(nameField, invalidNameMsg);
export const nameParamValidator = stringExistsParamValidator(nameField, invalidNameMsg);

export const namedObjectUpdateValidators = [
  idParamValidator,
  idBodyValidator,
  idBodyAndParamValidator,
  nameBodyValidator,
];

export const pageValidator = check(pageField, invalidPageMsg).if(check(pageField).exists).isInt({allow_leading_zeroes: false, min: 1});

export const validRegexValidator = body(validationExpressionField, invalidRegexMsg)
  .trim()
  .isLength({ min: 4 }).bail()
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
  return body(fieldName, noMatchForRegexMsg).trim().custom(value => new RegExp(validationExpression).test(value));
}


//