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
    connectionTypeIdBodyValidator,
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
    upperItemTypeIdField,
    lowerItemTypeIdField,
    connectionTypeIdField,
    maxConnectionsToLowerField,
    maxConnectionsToUpperField,
} from '../../util/fields.constants';
import {
    invalidUpperItemTypeMsg,
    invalidLowerItemTypeMsg,
    duplicateConnectionRuleMsg,
} from '../../util/messages.constants';
import { itemTypeModelValidateIdExists } from '../../models/abstraction-layer/meta-data/item-type.al';
import { connectionRuleModelValidateContentDoesNotExist } from '../../models/abstraction-layer/meta-data/connection-rule.al';

const router = express.Router();
const upperItemBodyValidator = mongoIdBodyValidator(upperItemTypeIdField, invalidUpperItemTypeMsg).bail()
    .custom(itemTypeModelValidateIdExists);
const lowerItemBodyValidator = mongoIdBodyValidator(lowerItemTypeIdField, invalidLowerItemTypeMsg).bail()
    .custom(itemTypeModelValidateIdExists);
const maxConnectionsToLowerBodyValidator = rangedNumberBodyValidator(maxConnectionsToLowerField);
const maxConnectionsToUpperBodyValidator = rangedNumberBodyValidator(maxConnectionsToUpperField);

// Create
router.post('/', [
    upperItemBodyValidator,
    lowerItemBodyValidator,
    connectionTypeIdBodyValidator,
    maxConnectionsToLowerBodyValidator,
    maxConnectionsToUpperBodyValidator,
    validRegexValidator,
    body(connectionTypeIdField, duplicateConnectionRuleMsg).custom((ct, { req }) => {
        const uit = req.body[upperItemTypeIdField];
        const lit = req.body[lowerItemTypeIdField];
        return connectionRuleModelValidateContentDoesNotExist(ct, uit, lit);
    }),
], isAdministrator, validate, createConnectionRule);

// Read
router.get(`/:${idField}`, [idParamValidator()], validate, getConnectionRule);

router.get(`/:${idField}/Connections/Count`, [idParamValidator()], validate, getConnectionsCountForConnectionRule);

// Update
router.put(`/:${idField}`, [
    idParamValidator(),
    idBodyValidator(),
    upperItemBodyValidator,
    lowerItemBodyValidator,
    connectionTypeIdBodyValidator,
    maxConnectionsToLowerBodyValidator,
    maxConnectionsToUpperBodyValidator,
    validRegexValidator,
], isAdministrator, validate, updateConnectionRule);

// Delete
router.delete(`/:${idField}`, [idParamValidator()], isAdministrator, validate, deleteConnectionRule);

// Check if can be deleted (no attributes exist)
router.get(`/:${idField}/CanDelete`, [idParamValidator()], validate, canDeleteConnectionRule);

router.get(`/upperItemType/:${upperIdField}/connectionType/:${connectionTypeIdField}/lowerItemType/:${lowerIdField}`, [
    upperIdParamValidator,
    lowerIdParamValidator,
    connectionTypeIdParamValidator,
], validate, getConnectionRuleByContent);

export default router;
