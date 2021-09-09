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
    connectionsToLowerField,
    countField,
    itemTypeIdField,
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
    invalidCountMsg,
    invalidItemTypeMsg,
    invalidResponsibleUserMsg,
} from '../util/messages.constants';
import { IConfigurationItem } from '../models/mongoose/configuration-item.model';
import { attributeGroupModel } from '../models/mongoose/attribute-group.model';
import { connectionTypeModel } from '../models/mongoose/connection-type.model';
import { itemTypeModel } from '../models/mongoose/item-type.model';
import { UserInfo } from '../models/item-data/user-info.model';

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

export const stringExistsBodyValidator = (fieldName: string | string[], message: string) => body(fieldName, message)
    .isString().bail().trim().isLength({ min: 1 });
export const stringExistsParamValidator = (fieldName: string | string[], message: string) => param(fieldName, message)
    .isString().bail().trim().isLength({ min: 1 });

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

export const pageValidator = check(pageField, invalidPageMsg).optional().isInt({allow_leading_zeroes: false, min: 1});

export const connectionTypeIdBodyValidator = mongoIdBodyValidator(connectionTypeIdField, invalidConnectionTypeMsg).bail()
    .custom(connectionTypeModel.validateIdExists);

export const validRegexValidator = body(validationExpressionField, invalidRegexMsg)
    .isString().bail().trim().isLength({ min: 4 }).bail()
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

export const attributeGroupBodyValidator = (fieldName: string) =>
    mongoIdBodyValidator(fieldName, invalidAttributeGroupMsg).bail().custom(attributeGroupModel.validateIdExists);

export const arrayBodyValidator = (fieldName: string, message: string) => body(fieldName, message).optional().isArray();

export function checkResponsibility(user: UserInfo | undefined, item: IConfigurationItem, newResponsibleUsers?: string[]) {
    if (!user) {
        throw new HttpError(403, missingResponsibilityMsg);
    }
    if (!item.responsibleUsers.map((u) => u.name).includes(user.accountName)) {
        // If user is not present in current item, but will be set in update, accept this, too. If neither is set, fail.
        if (!newResponsibleUsers || !newResponsibleUsers.map(u => u).includes(user.accountName)) {
            throw new HttpError(403, missingResponsibilityMsg);
        }
    }
}

export const regexBodyValidator = (field: string, message: string) => body(field, message)
    .trim().isLength({min: 1}).customSanitizer((value: string) => value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')); // replace regex characters
export const regexParamValidator = (field: string, message: string) => param(field, message)
    .trim().isLength({min: 1}).customSanitizer((value: string) => value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')); // replace regex characters

export const searchNameOrValueValidator = (field: string) => regexBodyValidator(field, invalidNameMsg).optional();
export const searchItemTypeIdValidator = (field: string) => body(field, invalidItemTypeMsg).optional().trim().isMongoId().bail()
    .custom(itemTypeModel.validateIdExists);
export const searchArrayValidator = (field: string, message: string) => body(field, message).optional().isArray();
export const searchDateValidator = (field: string, message: string) => body(field, message).optional()
    .custom(value => !isNaN(Date.parse(value))).customSanitizer(value => new Date(value));
export const searchResponsibleUserValidator = (field: string) => body(field, invalidResponsibleUserMsg).optional()
    .isString().bail().trim().toLowerCase().isLength({min: 1});
export const searchConnectionTypeValidator = (field: string) => body(`${field}.*.${connectionTypeIdField}`, invalidConnectionTypeMsg).if(body(field).exists)
    .isMongoId().bail().custom(connectionTypeModel.validateIdExists);
export const searchConnectionItemTypeValidator = (field: string) => body(`${field}.*.${itemTypeIdField}`, invalidItemTypeMsg).optional()
    .if(body(field).exists).isMongoId().bail().custom(itemTypeModel.validateIdExists);
export const searchConnectionCountValidator = (field: string) => body(`${field}.*.${countField}`, invalidCountMsg).if(body(connectionsToLowerField).exists)
    .isString().bail().isLength({min: 1, max: 2}).bail().custom((value: string) => ['0', '1', '1+', '2+'].includes(value));

export function validURL(link: string) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*))|' + // host name
        '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(link);
}
