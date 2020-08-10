import express from 'express';

import {
    idParamValidator,
    upperIdParamValidator,
    lowerIdParamValidator,
    connectionTypeIdParamValidator,
    validRegexValidator,
    idBodyValidator,
    idBodyAndParamValidator,
    mongoIdBodyValidator,
    rangedNumberBodyValidator
} from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import { body } from 'express-validator';
import {
    canDeleteConnectionRule,
    createConnectionRule,
    deleteConnectionRule,
    getConnectionRule,
    getConnectionsCountForConnectionRule,
    getConnectionRuleByContent,
    updateConnectionRule,
} from '../../controllers/meta-data/connection-rules.controller';
import {
    idField,
    upperIdField,
    lowerIdField,
    upperItemTypeField,
    lowerItemTypeField,
    connectionTypeField,
    maxConnectionsToLowerField,
    maxConnectionsToUpperField,
    connectionTypeIdfield,
} from '../../util/fields.constants';
import {
    invalidNumberMsg,
    invalidConnectionTypeMsg,
    invalidUpperItemTypeMsg,
    invalidLowerItemTypeMsg,
} from '../../util/messages.constants';

const router = express.Router();
const upperItemBodyValidator = mongoIdBodyValidator(upperItemTypeField, invalidUpperItemTypeMsg);
const lowerItemBodyValidator = mongoIdBodyValidator(lowerItemTypeField, invalidLowerItemTypeMsg);
const connectionTypeBodyValidator = mongoIdBodyValidator(connectionTypeField, invalidConnectionTypeMsg);
const maxConnectionsToLowerBodyValidator = rangedNumberBodyValidator(maxConnectionsToLowerField);
const maxConnectionsToUpperBodyValidator = rangedNumberBodyValidator(maxConnectionsToUpperField);

// Create
router.post('/', [
    upperItemBodyValidator,
    lowerItemBodyValidator,
    connectionTypeBodyValidator,
    maxConnectionsToLowerBodyValidator,
    maxConnectionsToUpperBodyValidator,
    validRegexValidator,
], isAdministrator, createConnectionRule);

// Read
router.get(`/:${idField}`, [idParamValidator], getConnectionRule);

router.get(`/:${idField}/Connections/Count`, [idParamValidator], getConnectionsCountForConnectionRule)

// Update
router.put(`/:${idField}`, [
    idParamValidator,
    idBodyValidator,
    idBodyAndParamValidator,
    upperItemBodyValidator,
    lowerItemBodyValidator,
    connectionTypeBodyValidator,
    maxConnectionsToLowerBodyValidator,
    maxConnectionsToUpperBodyValidator,
    validRegexValidator,
], isAdministrator, updateConnectionRule);

// Delete
router.delete(`/:${idField}`, [idParamValidator], isAdministrator, deleteConnectionRule);

// Check if can be deleted (no attributes exist)
router.get(`/:${idField}/CanDelete`, [idParamValidator], canDeleteConnectionRule);

router.get(`/upperItemType/:${upperIdField}/connectionType/:${connectionTypeIdfield}/lowerItemType/:${lowerIdField}}`, [
    upperIdParamValidator,
    lowerIdParamValidator,
    connectionTypeIdParamValidator,
], getConnectionRuleByContent);

export default router;
