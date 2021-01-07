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
  colorField,
} from '../util/fields.constants';
import {
  invalidNumberMsg,
  invalidIdInParamsMsg,
  invalidIdInBodyMsg,
  invalidUpperIdInParamsMsg,
  invalidLowerIdInParamsMsg,
  invalidConnectionTypeMsg,
  invalidNameMsg,
  invalidRegexMsg,
  validationErrorsMsg,
  invalidPageMsg,
  missingResponsibilityMsg,
  invalidAttributeGroupMsg,
  invalidColorMsg,
} from '../util/messages.constants';
import { IUser } from '../models/mongoose/user.model';
import { IConfigurationItem } from '../models/mongoose/configuration-item.model';
import { attributeGroupModel } from '../models/mongoose/attribute-group.model';
import { connectionTypeModel } from '../models/mongoose/connection-type.model';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return next(new HttpError(422, validationErrorsMsg, errors));
};

export const mongoIdBodyValidator = (fieldName: string | string[], message: string) => body(fieldName, message).trim().isLowercase().isMongoId();
export const mongoIdParamValidator = (fieldName: string | string[], message: string) => param(fieldName, message).trim().isLowercase().isMongoId();

export const rangedNumberBodyValidator = (fieldName: string | string[]) => body(fieldName, invalidNumberMsg)
  .trim()
  .isNumeric()
  .custom((input: number) => input > 0 && input < 10000);

export const stringExistsBodyValidator = (fieldName: string | string[], message: string) => body(fieldName, message).trim().isLength({ min: 1 });
export const stringExistsParamValidator = (fieldName: string | string[], message: string) => param(fieldName, message).trim().isLength({ min: 1 });

export const idParamValidator = () => mongoIdParamValidator(idField, invalidIdInParamsMsg);
export const idBodyValidator = () => mongoIdBodyValidator(idField, invalidIdInBodyMsg).bail()
  .custom((value: string, { req }) => req.params && req.params[idField] && value === req.params[idField].toString());

export const upperIdParamValidator = mongoIdParamValidator(upperIdField, invalidUpperIdInParamsMsg);
export const lowerIdParamValidator = mongoIdParamValidator(lowerIdField, invalidLowerIdInParamsMsg);
export const connectionTypeIdParamValidator = mongoIdParamValidator(connectionTypeIdField, invalidConnectionTypeMsg);

export const nameBodyValidator = () => stringExistsBodyValidator(nameField, invalidNameMsg);
export const nameParamValidator = stringExistsParamValidator(nameField, invalidNameMsg);

export const namedObjectUpdateValidators = [
  idParamValidator(),
  idBodyValidator(),
  nameBodyValidator(),
];

export const colorBodyValidator = body(colorField, invalidColorMsg).trim().isHexColor();

export const pageValidator = check(pageField, invalidPageMsg).if(check(pageField).exists).isInt({allow_leading_zeroes: false, min: 1});

export const connectionTypeIdBodyValidator = mongoIdBodyValidator(connectionTypeIdField, invalidConnectionTypeMsg).bail()
  .custom(connectionTypeModel.validateIdExists);

export const validRegexValidator = body(validationExpressionField, invalidRegexMsg)
  .trim()
  .isLength({ min: 4 }).bail()
  .custom((value: string) => {
    if (!value.startsWith('^') || !value.endsWith('$')) {
      return false;
    }
    try {
      // tslint:disable-next-line: no-unused-expression
      new RegExp(value);
    } catch (error) {
      return false;
    }
    return true;
  }
);

export const attributeGroupBodyValidator = (fieldName: string) =>
  mongoIdBodyValidator(fieldName, invalidAttributeGroupMsg).bail().custom(attributeGroupModel.validateIdExists);

export const arrayBodyValidator = (fieldName: string, message: string) => body(fieldName, message).if(body(fieldName).exists()).isArray();

export function checkResponsibility(user: IUser | undefined, item: IConfigurationItem, newResponsibleUsers?: string[]) {
  if (!user) {
    throw new HttpError(403, missingResponsibilityMsg);
  }
  if (!item.responsibleUsers.map((u) => u.name).includes(user.name)) {
    // If user is not present in current item, but will be set in update, accept this, too. If neither is set, fail.
    if (!newResponsibleUsers || !newResponsibleUsers.map(u => u).includes(user.name)) {
      throw new HttpError(403, missingResponsibilityMsg);
    }
  }
}
