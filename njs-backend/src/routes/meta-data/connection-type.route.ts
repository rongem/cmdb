import express from 'express';
import { body } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator, nameBodyValidator } from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import {
    getConnectionType,
    createConnectionType,
    updateConnectionType,
    deleteConnectionType,
    canDeleteConnectionType,
} from '../../controllers/meta-data/connection-type.controller';
import { id, reverseName } from '../../util/fields.constants';
import { invalidReverseName } from '../../util/messages.constants';

const router = express.Router();
const reverseNameBodyValidator = body(reverseName, invalidReverseName).trim().isLength({min: 1});

// Create
router.post('/', [
    nameBodyValidator,
    reverseNameBodyValidator,
], isAdministrator, createConnectionType);

// Read
router.get(`/:${id}`, [idParamValidator], getConnectionType);

// Update
router.put(`/:${id}`, [
    ...namedObjectUpdateValidators,
    reverseNameBodyValidator,
], isAdministrator, updateConnectionType);

// Delete
router.delete(`/:${id}`, [idParamValidator], isAdministrator, deleteConnectionType);

// Check if connection type can be deleted (no connection rules exist)
router.get(`/:${id}/CanDelete`, [idParamValidator], canDeleteConnectionType)

export default router;
