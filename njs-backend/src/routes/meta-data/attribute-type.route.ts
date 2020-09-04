import express from 'express';

import {
    namedObjectUpdateValidators,
    idParamValidator,
    nameBodyValidator,
    attributeGroupBodyValidator,
    validRegexValidator,
    validate,
} from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import { idField, attributeGroupIdField } from '../../util/fields.constants';
import {
    createAttributeType,
    updateAttributeType,
    getAttributeType,
    deleteAttributeType,
    canDeleteAttributeType,
    convertAttributeTypeToItemType,
    countAttributesForAttributeType,
} from '../../controllers/meta-data/attribute-type.controller';

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
router.move(`/:${idField}`, [idParamValidator()], validate, convertAttributeTypeToItemType);

export default router;
