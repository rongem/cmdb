import express from 'express';
import { body } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator, nameBodyValidator } from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import { getItemType, updateItemType, deleteItemType, createItemType, canDeleteItemType } from '../../controllers/meta-data/item-type.controller';
import { idField, colorField } from '../../util/fields.constants';
import { invalidColorMsg } from '../../util/messages.constants';

const router = express.Router();
const colorBodyValidator = body(colorField, invalidColorMsg).trim().isHexColor();

// Create
router.post(`/`, [
    nameBodyValidator,
    colorBodyValidator,
], isAdministrator, createItemType);

// Read
router.get(`/:${idField}`, [idParamValidator], getItemType);

// Update
router.put(`/:${idField}`, [
    ...namedObjectUpdateValidators,
    colorBodyValidator,
], isAdministrator, updateItemType);

// Delete
router.delete(`/:${idField}`, [idParamValidator], isAdministrator, deleteItemType);

// Check if can be deleted (no attributes exist)
router.get(`/:${idField}/CanDelete`, [idParamValidator], canDeleteItemType);

export default router;
