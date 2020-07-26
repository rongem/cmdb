import express from 'express';
import { body } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator, nameBodyValidator, validRegexValidator } from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import {
    createAttributeType,
    updateAttributeType,
    getAttributeType,
    deleteAttributeType,
    canDeleteAttributeType,
} from '../../controllers/meta-data/attribute-types.controller';

const router = express.Router();

const attributeGroupValidator = body('attributeGroup').trim().isMongoId().withMessage('No valid id for attribute group.');

// Create
router.post('/', [
    nameBodyValidator,
    attributeGroupValidator,
    validRegexValidator,
], isAdministrator, createAttributeType);

// Read
router.get('/:id', [idParamValidator], getAttributeType);

// Update
router.put('/:id', [
    ...namedObjectUpdateValidators,
    attributeGroupValidator,
    validRegexValidator,
], isAdministrator, updateAttributeType);

// Delete
router.delete('/:id', [idParamValidator], isAdministrator, deleteAttributeType);

// Check if can be deleted (no attributes exist)
router.get('/:id/CanDelete', [idParamValidator], canDeleteAttributeType)

export default router;
