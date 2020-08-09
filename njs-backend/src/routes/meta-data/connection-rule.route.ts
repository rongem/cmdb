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
    id,
    upperId,
    lowerId,
    upperItemType,
    lowerItemType,
    connectionType,
    maxConnectionsToLower,
    maxConnectionsToUpper,
    connectionTypeId,
} from '../../util/fields.constants';
import {
    invalidNumber,
    invalidConnectionType,
    invalidUpperItemType,
    invalidLowerItemType,
} from '../../util/messages.constants';

const router = express.Router();
const upperItemBodyValidator = mongoIdBodyValidator(upperItemType, invalidUpperItemType);
const lowerItemBodyValidator = mongoIdBodyValidator(lowerItemType, invalidLowerItemType);
const connectionTypeBodyValidator = mongoIdBodyValidator(connectionType, invalidConnectionType);
const maxConnectionsToLowerBodyValidator = rangedNumberBodyValidator(maxConnectionsToLower);
const maxConnectionsToUpperBodyValidator = rangedNumberBodyValidator(maxConnectionsToUpper);

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
router.get(`/:${id}`, [idParamValidator], getConnectionRule);

router.get(`/:${id}/Connections/Count`, [idParamValidator], getConnectionsCountForConnectionRule)

// Update
router.put(`/:${id}`, [
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
router.delete(`/:${id}`, [idParamValidator], isAdministrator, deleteConnectionRule);

// Check if can be deleted (no attributes exist)
router.get(`/:${id}/CanDelete`, [idParamValidator], canDeleteConnectionRule);

router.get(`/upperItemType/:${upperId}/connectionType/:${connectionTypeId}/lowerItemType/:${lowerId}}`, [
    upperIdParamValidator,
    lowerIdParamValidator,
    connectionTypeIdParamValidator,
], getConnectionRuleByContent);

export default router;
