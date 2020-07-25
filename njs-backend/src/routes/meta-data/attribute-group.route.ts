import express from 'express';
import { body, param } from 'express-validator';

import { 
    getAttributeGroup,
    createAttributeGroup,
    updateAttributeGroup,
    deleteAttributeGroup,
    canDeleteAttributeGroup } from '../../controllers/meta-data/attribute-groups.controller';
import { namedObjectUpdateValidators, idParamValidator, idBodyValidator, nameBodyValidator } from '../validators';

const router = express.Router();

// Create
router.post('/', [
    nameBodyValidator,
], createAttributeGroup);

// Read
router.get('/:id', [idParamValidator], getAttributeGroup);

// Update
router.put('/:id', [
    ...namedObjectUpdateValidators,
], updateAttributeGroup);

// Delete
router.delete('/:id', [idParamValidator], deleteAttributeGroup);

// Check if can be deleted (no attributes exist)
router.get('/:id/CanDelete', [idParamValidator], canDeleteAttributeGroup)

export default router;
