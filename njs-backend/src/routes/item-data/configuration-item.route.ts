import express from 'express';
import { body } from 'express-validator';

import {
    nameBodyValidator,
    idParamValidator,
    namedObjectUpdateValidators,
    mongoIdBodyValidator,
    stringExistsBodyValidator
} from '../validators';
import { isEditor } from '../../controllers/auth/authentication.controller';
import {
    validateConfigurationItem,
    createConfigurationItem,
    getConfigurationItem,
    updateConfigurationItem,
    deleteConfigurationItem,
} from '../../controllers/item-data/configuration-item.controller';
import {
    idField,
    attributesField,
    typeIdField,
    valueField,
    linksField,
    uriField,
    descriptionField,
} from '../../util/fields.constants';
import {
    invalidItemTypeMsg,
    noAttributesArrayMsg,
    invalidAttributeTypeMsg,
    invalidAttributeValueMsg,
    noLinksArrayMsg,
    invalidDescriptionMsg,
    invalidURIMsg,
} from '../../util/messages.constants';
import { itemTypeModel } from '../../models/mongoose/item-type.model';

const router = express.Router();
const typeIdBodyValidator = mongoIdBodyValidator(typeIdField, invalidItemTypeMsg).bail().custom((value: string) => itemTypeModel.validateIdExists(value));

const attributesBodyValidator = body(attributesField, noAttributesArrayMsg).if(body(attributesField).exists()).isArray();
const attributesTypeIdBodyValidator = mongoIdBodyValidator(`${attributesField}.*.${typeIdField}`, invalidAttributeTypeMsg);
const attributesValueBodyValidator = stringExistsBodyValidator(`${attributesField}.*.${valueField}`, invalidAttributeValueMsg);
const linksBodyValidator = body(linksField, noLinksArrayMsg).if(body(linksField).exists()).isArray();
const linkUriBodyValidator = body(`${linksField}.*.${uriField}`).trim().isURL({
    allow_protocol_relative_urls: false,
    allow_trailing_dot: false,
    require_protocol: true,
    require_host: true,
    protocols: ['http', 'https'],
    disallow_auth: true,
}).withMessage(invalidURIMsg);
const linkDescriptionBodyValidator = stringExistsBodyValidator(`${linksField}.*.${descriptionField}`, invalidDescriptionMsg);

// Create
router.post('/', [
    nameBodyValidator,
    typeIdBodyValidator,
    attributesBodyValidator,
    attributesTypeIdBodyValidator,
    attributesValueBodyValidator,
    linksBodyValidator,
    linkUriBodyValidator,
    linkDescriptionBodyValidator,
], isEditor, validateConfigurationItem, createConfigurationItem);

// Read
router.get(`/:${idField}`, [idParamValidator], getConfigurationItem);

// Update
router.put(`/:${idField}`, [
    ...namedObjectUpdateValidators,
    typeIdBodyValidator,
    attributesBodyValidator,
    attributesTypeIdBodyValidator,
    attributesValueBodyValidator,
    linksBodyValidator,
    linkUriBodyValidator,
    linkDescriptionBodyValidator,
], isEditor, validateConfigurationItem, updateConfigurationItem);

// Delete
router.delete(`/:${idField}`, [idParamValidator], isEditor, deleteConfigurationItem);

export default router;
