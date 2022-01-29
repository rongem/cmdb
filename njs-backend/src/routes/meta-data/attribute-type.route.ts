import express from 'express';

import {
    namedObjectUpdateValidators,
    idParamValidator,
    nameBodyValidator,
    attributeGroupBodyValidator,
    validRegexValidator,
    validate,
    stringExistsBodyValidator,
    colorBodyValidator,
    connectionTypeIdBodyValidator,
} from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import {
    idField,
    attributeGroupIdField,
    newItemTypeNameField,
    positionField,
    attributeTypesToTransferField,
} from '../../util/fields.constants';
import {
    aboveValue,
    belowValue,
} from '../../util/values.constants';
import {
    createAttributeType,
    updateAttributeType,
    getAttributeType,
    deleteAttributeType,
    canDeleteAttributeType,
    countAttributesForAttributeType,
    getCorrespondingAttributeTypes,
} from '../../controllers/meta-data/attribute-type.controller';
import { convertAttributeTypeToItemType } from '../../controllers/item-data/multi-model.controller';
import { body, param } from 'express-validator';
import { invalidPositionMsg, invalidAttributeTypesMsg, invalidAttributeTypeMsg } from '../../util/messages.constants';
import { ObjectId } from 'mongodb';
import {
    attributeTypeModelFind,
    attributeTypeModelFindSingle,
    attributeTypeModelValidateIdExists
} from '../../models/abstraction-layer/meta-data/attribute-type.al';
import { AttributeType } from '../../models/meta-data/attribute-type.model';

const router = express.Router();

// Create
router.post('/', [
    nameBodyValidator(),
    attributeGroupBodyValidator(attributeGroupIdField),
    validRegexValidator,
], isAdministrator, validate, createAttributeType);

// Read
router.get(`/:${idField}`, [idParamValidator()], validate, getAttributeType);

router.get(`/:${idField}/Attributes/Count`, [idParamValidator()], validate, countAttributesForAttributeType);

// prepare migrating by finding attributes with corresponding values
router.get(`/:${idField}/CorrespondingValuesOfType`, [
    idParamValidator(),
    param(idField, invalidAttributeTypeMsg).custom(attributeTypeModelValidateIdExists),
], validate, getCorrespondingAttributeTypes);

// Update
router.put(`/:${idField}`, [
    ...namedObjectUpdateValidators,
    attributeGroupBodyValidator(attributeGroupIdField),
    validRegexValidator,
], isAdministrator, validate, updateAttributeType);

// Delete
router.delete(`/:${idField}`, [idParamValidator()], isAdministrator, validate, deleteAttributeType);

// Check if can be deleted (no attributes exist)
router.get(`/:${idField}/CanDelete`, [idParamValidator()], validate, canDeleteAttributeType);

// migrate attribute type to item type and all connected attributes to items
router.post(`/:${idField}/ConvertToItemtype`, [
    idParamValidator().bail()
        .custom(async (value, { req }) => {
            req.attributeType = await attributeTypeModelFindSingle(value);
            return req.attributeType ? Promise.resolve() : Promise.reject();
        }),
    body(newItemTypeNameField).isString().bail().trim()
        .customSanitizer((value, { req }) => value && value !== '' ? value : (req.attributeType as AttributeType)?.name)
        .isLength({min: 1}).withMessage(invalidAttributeTypeMsg),
    stringExistsBodyValidator(positionField, invalidPositionMsg).bail()
        .customSanitizer((value: string) => value.toLocaleLowerCase())
        .custom(value => value === aboveValue || value === belowValue),
    colorBodyValidator,
    connectionTypeIdBodyValidator,
    body(attributeTypesToTransferField, invalidAttributeTypesMsg).optional().isArray().bail()
        .custom((values: string[]) => {
            values.forEach(value => {
                if (!ObjectId.isValid(value)) {
                    return false;
                }
            });
            return true;
        }).bail()
        .custom(async (values: string[], { req }) => {
            try {
                req.attributeTypes = await attributeTypeModelFind({ _id: { $in: values }});
                return (req.attributeTypes as AttributeType[]).length === values.length ? Promise.resolve() : Promise.reject();
            } catch (error) {
                Promise.reject(error);
            }
        }),
], isAdministrator, validate, convertAttributeTypeToItemType);

export default router;
