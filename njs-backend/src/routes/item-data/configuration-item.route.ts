import express from 'express';
import { body, param } from 'express-validator';

import { nameBodyValidator, idParamValidator, namedObjectUpdateValidators, mongoIdBodyValidator } from '../validators';
import { isEditor } from '../../controllers/auth/authentication.controller';
import {
    validateConfigurationItem,
    createConfigurationItem,
    getConfigurationItem,
    updateConfigurationItem,
} from '../../controllers/item-data/configuration-item.controller';
import attributeTypeModel from '../../models/mongoose/attribute-type.model';

const router = express.Router();
const typeIdBodyValidator = mongoIdBodyValidator('typeId', 'Not a valid type id.');
const attributesBodyValidator = body('attributes').if(body('attributes').exists()).isArray().withMessage('Attributes is not an array.');
const attributesTypeIdBodyValidator = mongoIdBodyValidator('attributes.*.typeId', 'Not a valid attribute type id.');
const attributesValueBodyValidator = body('attributes.*.value').trim().isLength({min: 1}).withMessage('No attribute value.');
const linksBodyValidator = body('links').if(body('links').exists()).isArray().withMessage('Links is not an array.');
const linkUriBodyValidator = body('links.*.uri').trim().isURL({
    allow_protocol_relative_urls: false,
    allow_trailing_dot: false,
    require_protocol: true,
    require_host: true,
    protocols: ['http', 'https'],
    disallow_auth: true,
}).withMessage('Not a valid URL');
const linkDescriptionBodyValidator = body('links.*.description').trim().isLength({min: 1}).withMessage('No description.');

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
router.get('/:id', [idParamValidator], getConfigurationItem);

// Update
router.put('/:id', [
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
router.delete('/:id', [idParamValidator], isEditor, updateConfigurationItem);

// Check if can be deleted (no attributes exist)
router.get('/:id/CanDelete')

export default router;
