import express from 'express';

import {
    idParamValidator,
    upperIdParamValidator,
    lowerIdParamValidator,
    connectionTypeIdParamValidator,
    validRegexValidator,
    idBodyValidator,
    mongoIdBodyValidator,
    rangedNumberBodyValidator,
    validate,
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
} from '../../controllers/meta-data/connection-rule.controller';
import {
    idField,
    upperIdField,
    lowerIdField,
    upperItemTypeField,
    lowerItemTypeField,
    connectionTypeIdField,
    maxConnectionsToLowerField,
    maxConnectionsToUpperField,
} from '../../util/fields.constants';
import {
    invalidNumberMsg,
    invalidConnectionTypeMsg,
    invalidUpperItemTypeMsg,
    invalidLowerItemTypeMsg,
    duplicateConnectionRuleMsg,
} from '../../util/messages.constants';
import { connectionRuleModel } from '../../models/mongoose/connection-rule.model';

const router = express.Router();
const upperItemBodyValidator = mongoIdBodyValidator(upperItemTypeField, invalidUpperItemTypeMsg);
const lowerItemBodyValidator = mongoIdBodyValidator(lowerItemTypeField, invalidLowerItemTypeMsg);
const connectionTypeBodyValidator = mongoIdBodyValidator(connectionTypeIdField, invalidConnectionTypeMsg);
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
    body(connectionTypeIdField, duplicateConnectionRuleMsg).custom((ct, {req}) => {
        const uit = req.body[upperItemTypeField];
        const lit = req.body[lowerItemTypeField];
        connectionRuleModel.validateContentDoesNotExist(ct, uit, lit);
    }),
], isAdministrator, createConnectionRule);

// Read
router.get(`/:${idField}`, [idParamValidator()], validate, getConnectionRule);

router.get(`/:${idField}/Connections/Count`, [idParamValidator()], validate, getConnectionsCountForConnectionRule)

// Update
router.put(`/:${idField}`, [
    idParamValidator(),
    idBodyValidator(),
    upperItemBodyValidator,
    lowerItemBodyValidator,
    connectionTypeBodyValidator,
    maxConnectionsToLowerBodyValidator,
    maxConnectionsToUpperBodyValidator,
    validRegexValidator,
], isAdministrator, validate, updateConnectionRule);

// Delete
router.delete(`/:${idField}`, [idParamValidator()], isAdministrator, validate, deleteConnectionRule);

// Check if can be deleted (no attributes exist)
router.get(`/:${idField}/CanDelete`, [idParamValidator], validate, canDeleteConnectionRule);

router.get(`/upperItemType/:${upperIdField}/connectionType/:${connectionTypeIdField}/lowerItemType/:${lowerIdField}}`, [
    upperIdParamValidator,
    lowerIdParamValidator,
    connectionTypeIdParamValidator,
], getConnectionRuleByContent);

export default router;
