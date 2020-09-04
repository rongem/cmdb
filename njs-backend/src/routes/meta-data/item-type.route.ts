import express from 'express';
import { body } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator, nameBodyValidator, validate } from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';
import { getItemType, updateItemType, deleteItemType, createItemType, canDeleteItemType } from '../../controllers/meta-data/item-type.controller';
import { idField, colorField, attributeGroupsField } from '../../util/fields.constants';
import {
    invalidColorMsg,
    invalidAttributeGroupsArrayMsg,
    noDuplicateTypesMsg,
    invalidAttributeGroupMsg,
} from '../../util/messages.constants';
import { attributeGroupModel } from '../../models/mongoose/attribute-group.model';

const router = express.Router();
const colorBodyValidator = body(colorField, invalidColorMsg).trim().isHexColor();
const attributeGroupsBodyValidator = body(attributeGroupsField, invalidAttributeGroupsArrayMsg).if(body(attributeGroupsField).exists())
    .isArray().bail().toArray()
    .custom((value: any[]) => {
        const uniqueIds = [...new Set(value.map(v => v[idField]))];
        return uniqueIds.length === value.length;
    }).withMessage(noDuplicateTypesMsg);
const attributeGroupIdsBodyValidator = body(`${attributeGroupsField}.*.${idField}`, invalidAttributeGroupMsg).isMongoId().bail()
    .custom(attributeGroupModel.validateIdExists);


// Create
router.post(`/`, [
    nameBodyValidator(),
    colorBodyValidator,
    attributeGroupsBodyValidator,
    attributeGroupIdsBodyValidator,
], isAdministrator, validate, createItemType);

// Read
router.get(`/:${idField}`, [idParamValidator()], validate, getItemType);

// Update
router.put(`/:${idField}`, [
    ...namedObjectUpdateValidators,
    colorBodyValidator,
    attributeGroupsBodyValidator,
    attributeGroupIdsBodyValidator,
], isAdministrator, validate, updateItemType);

// Delete
router.delete(`/:${idField}`, [idParamValidator()], isAdministrator, validate, deleteItemType);

// Check if can be deleted (no attributes exist)
router.get(`/:${idField}/CanDelete`, [idParamValidator()], validate, canDeleteItemType);

export default router;
