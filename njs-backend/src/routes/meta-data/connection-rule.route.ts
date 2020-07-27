import express from 'express';

import {
    idParamValidator,
    upperIdParamValidator,
    lowerIdParamValidator,
    connectionTypeIdParamValidator,
    validRegexValidator,
    idBodyValidator,
    idBodyAndParamValidator
} from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import { body, param } from 'express-validator';
import {
    canDeleteConnectionRule,
    createConnectionRule,
    deleteConnectionRule,
    getConnectionRule,
    getConnectionsCountForConnectionRule,
    getConnectionRuleByContent,
    updateConnectionRule,
} from '../../controllers/meta-data/connection-rules.controller';

const router = express.Router();
const upperItemBodyValidator = body('upperItemType').trim().isMongoId().withMessage('Invalid upper item type id.');
const lowerItemBodyValidator = body('lowerItemType').trim().isMongoId().withMessage('Invalid lower item type id.');
const connectionTypeBodyValidator = body('connectionType').trim().isMongoId().withMessage('Invalid connection type id.');
const maxConnectionsToLowerBodyValidator = body('maxConnectionsToLower', 'Not a valid number')
    .trim()
    .isNumeric()
    .custom((input: number) => input > 0 && input < 10000);
const maxConnectionsToUpperBodyValidator = body('maxConnectionsToUpper', 'Not a valid number')
    .trim()
    .isNumeric()
    .custom((input: number) => input > 0 && input < 10000);

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
router.get('/:id', [idParamValidator], getConnectionRule);

router.get(':id/Connections/Count', [idParamValidator], getConnectionsCountForConnectionRule)

// Update
router.put('/:id', [
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
router.delete('/:id', [idParamValidator], isAdministrator, deleteConnectionRule);

// Check if can be deleted (no attributes exist)
router.get('/:id/CanDelete', [idParamValidator], canDeleteConnectionRule);

router.get('/upperItemType/:upperid/connectionType/:ctid/lowerItemType/:lowerid}', [
    upperIdParamValidator,
    lowerIdParamValidator,
    connectionTypeIdParamValidator,
], getConnectionRuleByContent);

export default router;
