import express from 'express';
import { body, param } from 'express-validator';

import { getAttributeGroups, createAttributeGroup, updateAttributeGroup } from '../controllers/attribute-groups.controller';
import { namedObjectValidator } from './validators';

const router = express.Router();

// Create
router.post('/', createAttributeGroup);

// Read
router.get('/:id', );

// Update
router.patch('/:id', [
    ...namedObjectValidator,
], updateAttributeGroup);

// Delete
router.delete('/:id', );

// Check if can be deleted (no attributes exist)
router.get('/:id/CanDelete')

export default router;
