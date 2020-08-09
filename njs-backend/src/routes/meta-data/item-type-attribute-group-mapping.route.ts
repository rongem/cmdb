import express from 'express';
import { body, param } from 'express-validator';

import { isAdministrator } from '../../controllers/auth/authentication.controller';
import {
    createItemTypeAttributeGroupMapping,
    deleteItemTypeAttributeGroupMapping,
    getItemTypeAttributeMapping,
    canDeleteItemTypeAttributeGroupMapping,
} from '../../controllers/meta-data/item-type.controller';
import { mongoIdBodyValidator, mongoIdParamValidator } from '../validators';

const router = express.Router();
const itemTypeParamValidator = mongoIdParamValidator('itemType', 'No valid item type id.');
const itemTypeBodyValidator = mongoIdBodyValidator('itemType', 'No valid item type id.');
const attributeGroupParamValidator = mongoIdParamValidator('attributeGroup', 'No valid attribute group id');
const attributeGroupBodyValidtor = mongoIdBodyValidator('attributeGroup', 'No valid attribute group id');

// Create
router.post('/', [
    itemTypeBodyValidator,
    attributeGroupBodyValidtor,
], isAdministrator, createItemTypeAttributeGroupMapping);

// Read
router.get('/Group/:attributeGroup/ItemType/:itemType/CountAttributes"', [
    itemTypeParamValidator,
    attributeGroupParamValidator,
  ], getItemTypeAttributeMapping);
  
// Delete
router.delete('/group/:attributeGroup/itemType/:itemType', [
    itemTypeParamValidator, attributeGroupParamValidator
], isAdministrator, deleteItemTypeAttributeGroupMapping);

router.get('/group/:attributeGroup/itemType/:itemType/CanDelete', [
    itemTypeParamValidator, attributeGroupParamValidator
], canDeleteItemTypeAttributeGroupMapping);

export default router;
