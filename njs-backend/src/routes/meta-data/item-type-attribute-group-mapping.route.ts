import express from 'express';

import { isAdministrator } from '../../controllers/auth/authentication.controller';
import {
    createItemTypeAttributeGroupMapping,
    deleteItemTypeAttributeGroupMapping,
    countAttributesForItemTypeAttributeMapping,
    canDeleteItemTypeAttributeGroupMapping,
} from '../../controllers/meta-data/item-type.controller';
import {
    mongoIdBodyValidator,
    mongoIdParamValidator,
    attributeGroupBodyValidator,
    validate,
} from '../validators';
import { attributeGroupIdField, itemTypeIdField } from '../../util/fields.constants';
import { invalidItemTypeMsg, invalidAttributeGroupMsg, invalidMappingMsg, mappingAlreadyExistsMsg } from '../../util/messages.constants';
import { attributeGroupModel } from '../../models/mongoose/attribute-group.model';
import { IItemType, itemTypeModel } from '../../models/mongoose/item-type.model';

const router = express.Router();

const checkIfItemTypeExistsAndCache = async (itemTypeId: string, req: any) => {
    if (req.itemType && req.itemType.id === itemTypeId) {
        console.log('cache hit');
        return Promise.resolve(true);
    }
    try {
        const itemType: IItemType = await itemTypeModel.findById(itemTypeId);
        if (!itemType) {
            return Promise.reject();
        }
        req.itemType = itemType;
        return Promise.resolve(true);
    } catch (error) {
        return Promise.reject(error);
    }
};

const itemTypeParamValidator = mongoIdParamValidator(itemTypeIdField, invalidItemTypeMsg).bail()
    .custom((value, { req }) => checkIfItemTypeExistsAndCache(value, req)).bail();
const itemTypeBodyValidator = mongoIdBodyValidator(itemTypeIdField, invalidItemTypeMsg).bail()
    .custom((value, { req }) => checkIfItemTypeExistsAndCache(value, req));
const attributeGroupParamValidator = mongoIdParamValidator(attributeGroupIdField, invalidAttributeGroupMsg).bail()
    .custom(attributeGroupModel.validateIdExists)
    .custom((value, { req }) => req.itemType.attributeGroups.map((g: any) => g.toString()).includes(value)).withMessage(invalidMappingMsg);

// Create
router.post('/', [
    itemTypeBodyValidator,
    attributeGroupBodyValidator(attributeGroupIdField).bail()
        .custom((value, { req }) => !req.itemType.attributeGroups.map((g: any) => g.toString()).includes(value))
        .withMessage(mappingAlreadyExistsMsg),
], isAdministrator, validate, createItemTypeAttributeGroupMapping);

// Read
router.get(`/Group/:${attributeGroupIdField}/ItemType/:${itemTypeIdField}/CountAttributes`, [
    itemTypeParamValidator,
    attributeGroupParamValidator,
  ], validate, countAttributesForItemTypeAttributeMapping);

// Delete
router.delete(`/group/:${attributeGroupIdField}/itemType/:${itemTypeIdField}`, [
    itemTypeParamValidator, attributeGroupParamValidator
], isAdministrator, validate, deleteItemTypeAttributeGroupMapping);

router.get(`/group/:${attributeGroupIdField}/itemType/:${itemTypeIdField}/CanDelete`, [
    itemTypeParamValidator, attributeGroupParamValidator
], validate, canDeleteItemTypeAttributeGroupMapping);

export default router;
