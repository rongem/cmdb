import express from 'express';

import { isAdministrator } from '../../controllers/auth/authentication.controller';
import {
    createItemTypeAttributeGroupMapping,
    deleteItemTypeAttributeGroupMapping,
    getItemTypeAttributeMapping,
    canDeleteItemTypeAttributeGroupMapping,
} from '../../controllers/meta-data/item-type.controller';
import { mongoIdBodyValidator, mongoIdParamValidator, validate } from '../validators';
import { attributeGroupField, attributeGroupIdField, itemTypeField, itemTypeIdField } from '../../util/fields.constants';
import { invalidItemTypeMsg, invalidAttributeGroupMsg } from '../../util/messages.constants';

const router = express.Router();
const itemTypeParamValidator = mongoIdParamValidator(itemTypeField, invalidItemTypeMsg);
const itemTypeBodyValidator = mongoIdBodyValidator(itemTypeIdField, invalidItemTypeMsg);
const attributeGroupParamValidator = mongoIdParamValidator(attributeGroupField, invalidAttributeGroupMsg);
const attributeGroupBodyValidtor = mongoIdBodyValidator(attributeGroupIdField, invalidAttributeGroupMsg);

// Create
router.post('/', [
    itemTypeBodyValidator,
    attributeGroupBodyValidtor,
], isAdministrator, validate, createItemTypeAttributeGroupMapping);

// Read
router.get(`/Group/:${attributeGroupField}/ItemType/:${itemTypeField}/CountAttributes"`, [
    itemTypeParamValidator,
    attributeGroupParamValidator,
  ], getItemTypeAttributeMapping);
  
// Delete
router.delete(`/group/:${attributeGroupField}/itemType/:${itemTypeField}`, [
    itemTypeParamValidator, attributeGroupParamValidator
], isAdministrator, validate, deleteItemTypeAttributeGroupMapping);

router.get(`/group/:${attributeGroupField}/itemType/:${itemTypeField}/CanDelete`, [
    itemTypeParamValidator, attributeGroupParamValidator
], validate, canDeleteItemTypeAttributeGroupMapping);

export default router;
