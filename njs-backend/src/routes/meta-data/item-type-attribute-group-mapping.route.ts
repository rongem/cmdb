import express from 'express';
import { body, param } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator } from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';

const router = express.Router();

// Create
router.post('/', [
], isAdministrator, );

// Read
router.get('/:id', [idParamValidator], );

// Delete
router.delete('/:id', [idParamValidator], isAdministrator, );

export default router;
