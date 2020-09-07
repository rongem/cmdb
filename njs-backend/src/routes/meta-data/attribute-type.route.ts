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
    arrayBodyValidator,
    mongoIdParamValidator,
} from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import {
    idField,
    attributeGroupIdField,
    newItemTypeNameField,
    positionField,
    aboveValue,
    belowValue,
    attributeTypesToTransferField,
} from '../../util/fields.constants';
import {
    createAttributeType,
    updateAttributeType,
    getAttributeType,
    deleteAttributeType,
    canDeleteAttributeType,
    convertAttributeTypeToItemType,
    countAttributesForAttributeType,
} from '../../controllers/meta-data/attribute-type.controller';
import { attributeTypeModel } from '../../models/mongoose/attribute-type.model';
import { body } from 'express-validator';
import { invalidPositionMsg, invalidAttributeTypesMsg, invalidAttributeTypeMsg } from '../../util/messages.constants';

const router = express.Router();

// Create
router.post('/', [
    nameBodyValidator(),
    attributeGroupBodyValidator(attributeGroupIdField),
    validRegexValidator,
], isAdministrator, validate, createAttributeType);

// Read
router.get(`/:${idField}`, [idParamValidator()], getAttributeType);

router.get(`/:${idField}/Attributes/Count`, [idParamValidator()], countAttributesForAttributeType);

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
router.move(`/:${idField}`, [
    idParamValidator().bail()
        .custom(async (value, { req }) => {
            req.attributeType = await attributeTypeModel.findById(value);
            return req.attributeType ? Promise.resolve() : Promise.reject();
        }),
    body(newItemTypeNameField).trim().customSanitizer((value, { req }) => value && value !== '' ? value : req.attributeType.name),
    stringExistsBodyValidator(positionField, invalidPositionMsg).bail()
        .customSanitizer((value: string) => value.toLocaleLowerCase())
        .custom(value => value === aboveValue || value === belowValue),
    colorBodyValidator,
    connectionTypeIdBodyValidator,
    body(attributeTypesToTransferField, invalidAttributeTypesMsg).isArray()
        .custom(async (values: string[], { req }) => {
            req.attributeTypes = await attributeTypeModel.find({ _id: { $in: values }});
            return req.attributeTypes.length === values.length ? Promise.resolve() : Promise.reject();
        }),
    mongoIdParamValidator(`${attributeTypesToTransferField}.*`, invalidAttributeTypeMsg),
], validate, convertAttributeTypeToItemType);

export default router;
