import express from 'express';

import { 
    getAttributeGroup,
    createAttributeGroup,
    updateAttributeGroup,
    deleteAttributeGroup,
    canDeleteAttributeGroup } from '../../controllers/meta-data/attribute-groups.controller';
import { namedObjectUpdateValidators, idParamValidator, nameBodyValidator } from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import { idField } from '../../util/fields.constants';

const router = express.Router();

// Create
router.post('/', [
    nameBodyValidator,
], isAdministrator, createAttributeGroup);

// Read
router.get(`/:${idField}`, [idParamValidator], getAttributeGroup);

// Update
router.put(`/:${idField}`, [
    ...namedObjectUpdateValidators,
], isAdministrator, updateAttributeGroup);

// Delete
router.delete(`/:${idField}`, [idParamValidator], isAdministrator, deleteAttributeGroup);

// Check if can be deleted (no attributes exist)
router.get(`/:${idField}/CanDelete`, [idParamValidator], canDeleteAttributeGroup);

export default router;
