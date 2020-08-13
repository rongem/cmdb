import express from 'express';

import {
    namedObjectUpdateValidators,
    idParamValidator,
    nameBodyValidator,
    stringExistsBodyValidator,
    validate,
} from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import {
    getConnectionType,
    createConnectionType,
    updateConnectionType,
    deleteConnectionType,
    canDeleteConnectionType,
} from '../../controllers/meta-data/connection-type.controller';
import { idField, reverseNameField } from '../../util/fields.constants';
import { invalidReverseNameMsg } from '../../util/messages.constants';

const router = express.Router();
const reverseNameBodyValidator = stringExistsBodyValidator(reverseNameField, invalidReverseNameMsg);

// Create
router.post('/', [
    nameBodyValidator,
    reverseNameBodyValidator,
], isAdministrator, validate, createConnectionType);

// Read
router.get(`/:${idField}`, [idParamValidator], getConnectionType);

// Update
router.put(`/:${idField}`, [
    ...namedObjectUpdateValidators,
    reverseNameBodyValidator,
], isAdministrator, validate, updateConnectionType);

// Delete
router.delete(`/:${idField}`, [idParamValidator], isAdministrator, validate, deleteConnectionType);

// Check if connection type can be deleted (no connection rules exist)
router.get(`/:${idField}/CanDelete`, [idParamValidator], validate, canDeleteConnectionType)

export default router;
