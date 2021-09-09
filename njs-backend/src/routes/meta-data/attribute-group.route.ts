import express from 'express';

import {
    getAttributeGroup,
    createAttributeGroup,
    updateAttributeGroup,
    deleteAttributeGroup,
    canDeleteAttributeGroup
} from '../../controllers/meta-data/attribute-group.controller';
import {
    namedObjectUpdateValidators,
    idParamValidator,
    nameBodyValidator,
    mongoIdParamValidator,
    validate
} from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import { idField, itemTypeIdField } from '../../util/fields.constants';
import { invalidItemTypeMsg, invalidMappingMsg } from '../../util/messages.constants';
import { itemTypeModel } from '../../models/mongoose/item-type.model';
import { countAttributesForItemTypeAttributeMapping } from '../../controllers/meta-data/item-type.controller';
import { attributeGroupModelValidateIdExists } from '../../models/abstraction-layer/meta-data/attribute-group.al';

const router = express.Router();

const checkIfItemTypeExistsAndCache = async (itemTypeId: string, req: any) => {
    if (req.itemType && req.itemType.id === itemTypeId) {
        // console.log('cache hit');
        return Promise.resolve(true);
    }
    try {
        const itemType = await itemTypeModel.findById(itemTypeId);
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
const attributeGroupParamValidator = idParamValidator().bail()
    .custom(attributeGroupModelValidateIdExists).bail()
    .custom((value, { req }) => req.itemType.attributeGroups.map((g: any) => g.toString()).includes(value)).withMessage(invalidMappingMsg);

// Create
router.post('/', [
    nameBodyValidator(),
], isAdministrator, validate, createAttributeGroup);

// Read
router.get(`/:${idField}`, [idParamValidator()], validate, getAttributeGroup);

// Update
router.put(`/:${idField}`, [
    ...namedObjectUpdateValidators,
], isAdministrator, validate, updateAttributeGroup);

// Delete
router.delete(`/:${idField}`, [idParamValidator()], isAdministrator, validate, deleteAttributeGroup);

// Check if can be deleted (no attributes exist)
router.get(`/:${idField}/CanDelete`, [idParamValidator()], validate, canDeleteAttributeGroup);

router.get(`/:${idField}/ItemType/:${itemTypeIdField}/CountAttributes`, [
    itemTypeParamValidator,
    attributeGroupParamValidator,
  ], validate, countAttributesForItemTypeAttributeMapping);

export default router;
