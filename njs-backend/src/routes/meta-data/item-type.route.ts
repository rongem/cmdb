import express from 'express';
import { body, param } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator, nameBodyValidator } from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';

const router = express.Router();

// Create
router.post('/', [
    nameBodyValidator,
], isAdministrator, );

// Read
router.get('/:id', [idParamValidator], );

// Update
router.put('/:id', [
    ...namedObjectUpdateValidators,
], isAdministrator, );

// Delete
router.delete('/:id', [idParamValidator], isAdministrator, );

// Check if can be deleted (no attributes exist)
router.get('/:id/CanDelete', [idParamValidator])

export default router;
