import express from 'express';

import { idParamValidator, upperIdParamValidator, lowerIdParamValidator, connectionTypeIdParamValidator } from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
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

// Create
router.post('/', [
], isAdministrator, createConnectionRule);

// Read
router.get('/:id', [idParamValidator], getConnectionRule);

router.get(':id/Connections/Count', [idParamValidator], getConnectionsCountForConnectionRule)

// Update
router.put('/:id', [
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
