import express from 'express';
import { body } from 'express-validator';

import { nameBodyValidator, idParamValidator, namedObjectUpdateValidators, mongoIdBodyValidator } from '../validators';
import { isEditor } from '../../controllers/auth/authentication.controller';
import {
    validateConfigurationItem,
    createConfigurationItem,
    getConfigurationItem,
    updateConfigurationItem,
} from '../../controllers/item-data/configuration-item.controller';
import {
    id,
    attributes,
    typeId,
    value,
    links,
    uri,
    description,
} from '../../util/fields.constants';
import {
    invalidItemType,
    noAttributesArray,
    invalidAttributeType,
    invalidAttributeValue,
    noLinksArray,
    invalidDescription,
    invalidURI,
} from '../../util/messages.constants';

const router = express.Router();
const typeIdBodyValidator = mongoIdBodyValidator(typeId, invalidItemType);
const attributesBodyValidator = body(attributes, noAttributesArray).if(body(attributes).exists()).isArray();
const attributesTypeIdBodyValidator = mongoIdBodyValidator(`${attributes}.*.${typeId}`, invalidAttributeType);
const attributesValueBodyValidator = body(`${attributes}.*.${value}`, invalidAttributeValue).trim().isLength({ min: 1 });
const linksBodyValidator = body(links, noLinksArray).if(body(links).exists()).isArray();
const linkUriBodyValidator = body(`${links}.*.${uri}`).trim().isURL({
    allow_protocol_relative_urls: false,
    allow_trailing_dot: false,
    require_protocol: true,
    require_host: true,
    protocols: ['http', 'https'],
    disallow_auth: true,
}).withMessage(invalidURI);
const linkDescriptionBodyValidator = body(`${links}.*.${description}`, invalidDescription).trim().isLength({ min: 1 });

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
router.get(`/:${id}`, [idParamValidator], getConfigurationItem);

// Update
router.put(`/:${id}`, [
    ...namedObjectUpdateValidators,
    typeIdBodyValidator,
    attributesBodyValidator,
    attributesTypeIdBodyValidator,
    attributesValueBodyValidator,
    linksBodyValidator,
    linkUriBodyValidator,
    linkDescriptionBodyValidator,
], isEditor, validateConfigurationItem);

// Delete
router.delete(`/:${id}`, [idParamValidator], isEditor, updateConfigurationItem);

export default router;
