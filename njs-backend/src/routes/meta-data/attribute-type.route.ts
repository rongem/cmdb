import express from 'express';

import { namedObjectUpdateValidators, idParamValidator, nameBodyValidator, validRegexValidator, mongoIdBodyValidator } from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import { attributeGroup } from '../../util/fields.constants';
    import {
        createAttributeType,
        updateAttributeType,
        getAttributeType,
        deleteAttributeType,
        canDeleteAttributeType,
        convertAttributeTypeToItemType,
    } from '../../controllers/meta-data/attribute-types.controller';

const router = express.Router();

const attributeGroupValidator = mongoIdBodyValidator(attributeGroup, 'No valid id for attribute group.');

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
router.get('/:id/CanDelete', [idParamValidator], canDeleteAttributeType);

// migrate attribute type to item type and all connected attributes to items
router.move('/:id/ConvertToItemType', [idParamValidator], convertAttributeTypeToItemType);

export default router;
