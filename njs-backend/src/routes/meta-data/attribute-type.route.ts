import express from 'express';
import { body, param } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator } from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';

const router = express.Router();

// Create

// Read

// Update

// Delete

// Check if can be deleted (no attributes exist)
router.get('/:id/CanDelete')

export default router;
