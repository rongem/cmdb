import express from 'express';
import { body } from 'express-validator';

import {
    namedObjectUpdateValidators,
    idParamValidator,
    nameBodyValidator,
    attributeGroupBodyValidator,
    colorBodyValidator,
    validate,
} from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import { getItemType, updateItemType, deleteItemType, createItemType, canDeleteItemType } from '../../controllers/meta-data/item-type.controller';
import { idField, attributeGroupsField } from '../../util/fields.constants';
import {
    invalidAttributeGroupsArrayMsg,
    noDuplicateTypesMsg,
} from '../../util/messages.constants';

const router = express.Router();

const attributeGroupsBodyValidator = body(attributeGroupsField, invalidAttributeGroupsArrayMsg).optional()
    .isArray().bail().toArray()
    .custom((value: {[idField]: string}[]) => {
        const uniqueIds = [...new Set(value.map(v => v[idField] ?? ''))];
        return uniqueIds.length === value.length && !uniqueIds.includes('');
    }).withMessage(noDuplicateTypesMsg);

// Create
router.post(`/`, [
    nameBodyValidator(),
    colorBodyValidator,
    attributeGroupsBodyValidator,
    attributeGroupBodyValidator(`${attributeGroupsField}.*.${idField}`),
], isAdministrator, validate, createItemType);

// Read
router.get(`/:${idField}`, [idParamValidator()], validate, getItemType);

// Update
router.put(`/:${idField}`, [
    ...namedObjectUpdateValidators,
    colorBodyValidator,
    attributeGroupsBodyValidator,
    attributeGroupBodyValidator(`${attributeGroupsField}.*.${idField}`),
], isAdministrator, validate, updateItemType);

// Delete
router.delete(`/:${idField}`, [idParamValidator()], isAdministrator, validate, deleteItemType);

// Check if can be deleted (no attributes exist)
router.get(`/:${idField}/CanDelete`, [idParamValidator()], validate, canDeleteItemType);

export default router;
