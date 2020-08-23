import express from 'express';

import { 
    getAttributeGroup,
    createAttributeGroup,
    updateAttributeGroup,
    deleteAttributeGroup,
    canDeleteAttributeGroup } from '../../controllers/meta-data/attribute-group.controller';
import { namedObjectUpdateValidators, idParamValidator, nameBodyValidator, validate } from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import { idField } from '../../util/fields.constants';

const router = express.Router();

// Create
router.post('/', [
    nameBodyValidator,
], isAdministrator, validate, createAttributeGroup);

// Read
router.get(`/:${idField}`, [idParamValidator()], getAttributeGroup);

// Update
router.put(`/:${idField}`, [
    ...namedObjectUpdateValidators,
], isAdministrator, validate, updateAttributeGroup);

// Delete
router.delete(`/:${idField}`, [idParamValidator()], isAdministrator, validate, deleteAttributeGroup);

// Check if can be deleted (no attributes exist)
router.get(`/:${idField}/CanDelete`, [idParamValidator()], validate, canDeleteAttributeGroup);

export default router;
