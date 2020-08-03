import express from 'express';
import { body, param } from 'express-validator';

import { isAdministrator } from '../../controllers/auth/authentication.controller';
import {
    createItemTypeAttributeGroupMapping, deleteItemTypeAttributeGroupMapping,
} from '../../controllers/meta-data/item-type.controller';

const router = express.Router();
const itemTypeBodyValidator = body('itemType').trim().isMongoId().withMessage('No valid item type id.');
const itemTypeParamValidator = param('itemType').trim().isMongoId().withMessage('No valid item type id.');
const attributeGroupParamValidator = param('attributeGroup').trim().isMongoId().withMessage('No valid attribute group id');

const attributeGroupBodyValidtor = body('attributeGroup').trim().isMongoId().withMessage('No valid attribute group id');

// Create
router.post('/', [
    itemTypeBodyValidator,
    attributeGroupBodyValidtor,
], isAdministrator, createItemTypeAttributeGroupMapping);

// Read
router.get('/Group/:attributeGroup/ItemType/:itemType/CountAttributes"', [
    itemTypeParamValidator,
    attributeGroupParamValidator,
  ]);
  
// Delete
router.delete('/group/:attributeGroup/itemType/:itemType', [
    itemTypeParamValidator, attributeGroupParamValidator
], isAdministrator, deleteItemTypeAttributeGroupMapping);

router.get('/group/:attributeGroup/itemType/:itemType/CanDelete', [
    itemTypeParamValidator, attributeGroupParamValidator
]);

export default router;
