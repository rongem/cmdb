import express from 'express';
import { body, param } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator } from '../validators';
import { isEditor } from '../../controllers/auth/authentication.controller';
import {
    idField,
} from '../../util/fields.constants';

const router = express.Router();

// Create

// Read

// Update

// Delete

// Check if can be deleted (no attributes exist)
router.get(`/:${idField}/CanDelete`)

export default router;
