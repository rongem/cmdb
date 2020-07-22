import express from 'express';
import { body, param } from 'express-validator';

import { getAttributeGroups, createAttributeGroup, updateAttributeGroup } from '../controllers/attribute-groups.controller';
import { namedObjectUpdateValidators, idParamValidator } from './validators';

const router = express.Router();

// Create
router.post('/', createAttributeGroup);

// Read
router.get('/:id', [idParamValidator]);

// Update
router.patch('/:id', [
    ...namedObjectUpdateValidators,
], updateAttributeGroup);

// Delete
router.delete('/:id', );

// Check if can be deleted (no attributes exist)
router.get('/:id/CanDelete')

export default router;
