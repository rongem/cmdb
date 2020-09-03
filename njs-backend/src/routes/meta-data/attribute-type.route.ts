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
import { attributeGroupIdField } from '../../util/fields.constants';
import {
    createAttributeType,
    updateAttributeType,
    getAttributeType,
    deleteAttributeType,
    canDeleteAttributeType,
    convertAttributeTypeToItemType,
    countAttributesForAttributeType,
} from '../../controllers/meta-data/attribute-type.controller';
import { idField } from '../../util/fields.constants';
import { invalidAttributeGroupMsg } from '../../util/messages.constants';
import { attributeGroupModel } from '../../models/mongoose/attribute-group.model';

const router = express.Router();

const attributeGroupValidator = mongoIdBodyValidator(attributeGroupIdField, invalidAttributeGroupMsg).custom(attributeGroupModel.validateIdExists);

// Create
router.post('/', [
    nameBodyValidator,
    attributeGroupValidator,
    validRegexValidator,
], isAdministrator, validate, createAttributeType);

// Read
router.get(`/:${idField}`, [idParamValidator()], getAttributeType);

router.get(`/:${idField}/Attributes/Count`, [idParamValidator()], countAttributesForAttributeType);

// Update
router.put(`/:${idField}`, [
    ...namedObjectUpdateValidators,
    attributeGroupValidator,
    validRegexValidator,
], isAdministrator, validate, updateAttributeType);

// Delete
router.delete(`/:${idField}`, [idParamValidator()], isAdministrator, validate, deleteAttributeType);

// Check if can be deleted (no attributes exist)
router.get(`/:${idField}/CanDelete`, [idParamValidator()], validate, canDeleteAttributeType);

// migrate attribute type to item type and all connected attributes to items
router.move(`/:${idField}`, [idParamValidator()], validate, convertAttributeTypeToItemType);

export default router;
