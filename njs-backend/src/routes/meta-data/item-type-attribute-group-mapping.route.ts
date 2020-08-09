import express from 'express';

import { isAdministrator } from '../../controllers/auth/authentication.controller';
import {
    createItemTypeAttributeGroupMapping,
    deleteItemTypeAttributeGroupMapping,
    getItemTypeAttributeMapping,
    canDeleteItemTypeAttributeGroupMapping,
} from '../../controllers/meta-data/item-type.controller';
import { mongoIdBodyValidator, mongoIdParamValidator } from '../validators';
import { attributeGroup, itemType } from '../../util/fields.constants';
import { invalidItemType, invalidAttributeGroup } from '../../util/messages.constants';

const router = express.Router();
const itemTypeParamValidator = mongoIdParamValidator(itemType, invalidItemType);
const itemTypeBodyValidator = mongoIdBodyValidator(itemType, invalidItemType);
const attributeGroupParamValidator = mongoIdParamValidator(attributeGroup, invalidAttributeGroup);
const attributeGroupBodyValidtor = mongoIdBodyValidator(attributeGroup, invalidAttributeGroup);

// Create
router.post('/', [
    itemTypeBodyValidator,
    attributeGroupBodyValidtor,
], isAdministrator, createItemTypeAttributeGroupMapping);

// Read
router.get(`/Group/:${attributeGroup}/ItemType/:${itemType}/CountAttributes"`, [
    itemTypeParamValidator,
    attributeGroupParamValidator,
  ], getItemTypeAttributeMapping);
  
// Delete
router.delete(`/group/:${attributeGroup}/itemType/:${itemType}`, [
    itemTypeParamValidator, attributeGroupParamValidator
], isAdministrator, deleteItemTypeAttributeGroupMapping);

router.get(`/group/:${attributeGroup}/itemType/:${itemType}/CanDelete`, [
    itemTypeParamValidator, attributeGroupParamValidator
], canDeleteItemTypeAttributeGroupMapping);

export default router;
