import express from 'express';

import { 
    getAttributeGroup,
    createAttributeGroup,
    updateAttributeGroup,
    deleteAttributeGroup,
    canDeleteAttributeGroup } from '../../controllers/meta-data/attribute-groups.controller';
import { namedObjectUpdateValidators, idParamValidator, nameBodyValidator } from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import { id } from '../../util/fields.constants';

const router = express.Router();

// Create
router.post('/', [
    nameBodyValidator,
], isAdministrator, createAttributeGroup);

// Read
router.get(`/:${id}`, [idParamValidator], getAttributeGroup);

// Update
router.put(`/:${id}`, [
    ...namedObjectUpdateValidators,
], isAdministrator, updateAttributeGroup);

// Delete
router.delete(`/:${id}`, [idParamValidator], isAdministrator, deleteAttributeGroup);

// Check if can be deleted (no attributes exist)
router.get(`/:${id}/CanDelete`, [idParamValidator], canDeleteAttributeGroup);

export default router;
