import express from 'express';
import { check } from 'express-validator/check';

import { getAttributeGroups, createAttributeGroup } from '../controllers/attribute-groups.controller';

const router = express.Router();

// Create
router.post('/', createAttributeGroup);

// Read
router.get('/:id', );

// Update
router.patch('/:id', );

// Delete
router.delete('/:id', );

// Check if can be deleted (no attributes exist)
router.get('/:id/CanDelete')

export default router;
