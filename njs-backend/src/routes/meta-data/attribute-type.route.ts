import express from 'express';

import {
    namedObjectUpdateValidators,
    idParamValidator,
    nameBodyValidator,
    validRegexValidator,
    mongoIdBodyValidator,
    validate,
} from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import { attributeGroupField } from '../../util/fields.constants';
import {
    createAttributeType,
    updateAttributeType,
    getAttributeType,
    deleteAttributeType,
    canDeleteAttributeType,
    convertAttributeTypeToItemType,
} from '../../controllers/meta-data/attribute-types.controller';
import { idField } from '../../util/fields.constants';
import { invalidAttributeGroupMsg } from '../../util/messages.constants';

const router = express.Router();

const attributeGroupValidator = mongoIdBodyValidator(attributeGroupField, invalidAttributeGroupMsg);

// Create
router.post('/', [
    nameBodyValidator,
    attributeGroupValidator,
    validRegexValidator,
], isAdministrator, validate, createAttributeType);

// Read
router.get(`/:${idField}`, [idParamValidator], getAttributeType);

// Update
router.put(`/:${idField}`, [
    ...namedObjectUpdateValidators,
    attributeGroupValidator,
    validRegexValidator,
], isAdministrator, validate, updateAttributeType);

// Delete
router.delete(`/:${idField}`, [idParamValidator], isAdministrator, validate, deleteAttributeType);

// Check if can be deleted (no attributes exist)
router.get(`/:${idField}/CanDelete`, [idParamValidator], validate, canDeleteAttributeType);

// migrate attribute type to item type and all connected attributes to items
router.move(`/:${idField}`, [idParamValidator], validate, convertAttributeTypeToItemType);

export default router;
