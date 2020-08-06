import express from 'express';
import { body } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator, nameBodyValidator } from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import { getItemType, updateItemType, deleteItemType, createItemType, canDeleteItemType } from '../../controllers/meta-data/item-type.controller';

const router = express.Router();
const colorBodyValidator = body('color').trim().isHexColor().withMessage('No valid color code.');

// Create
router.post('/', [
    nameBodyValidator,
    colorBodyValidator,
], isAdministrator, createItemType);

// Read
router.get('/:id', [idParamValidator], getItemType);

// Update
router.put('/:id', [
    ...namedObjectUpdateValidators,
    colorBodyValidator,
], isAdministrator, updateItemType);

// Delete
router.delete('/:id', [idParamValidator], isAdministrator, deleteItemType);

// Check if can be deleted (no attributes exist)
router.get('/:id/CanDelete', [idParamValidator], canDeleteItemType);

export default router;
