import express from 'express';
import { body, param } from 'express-validator';

import { nameBodyValidator } from '../validators';
import { isEditor } from '../../controllers/auth/authentication.controller';
import {
    createConfigurationItem
} from '../../controllers/item-data/configuration-item.controller';
import { ItemAttribute } from '../../models/item-data/item-attribute.model';
import itemTypeModel from '../../models/mongoose/item-type.model';
import attributeTypeModel from '../../models/mongoose/attribute-type.model';

const router = express.Router();
const typeIdBodyValidator = body('typeId').trim().isMongoId().withMessage('No type id.').bail();
const attributesBodyValidator = body('attributes').if(body('attributes').exists()).isArray().withMessage('Attributes is not an array.');
const attributesTypeIdBodyValidator = body('attributes.*.typeId').trim().isMongoId().withMessage('Not a valid type id').bail()
    .custom((value: string, { req }) => attributeTypeModel.findById(value).countDocuments()
        .then(count => {
            console.log(count);
            if(count === 0) {
                Promise.resolve(false);
            };
        }))
    .withMessage('Attribute type with that id doesn\'t exists.');
const attributesValueBodyValidator = body('attributes.*.value').trim().isLength({min: 1}).withMessage('No attribute value');
const linksBodyValidator = body('links').if(body('links').exists()).isArray().withMessage('Links is not an array.');
const linkUriBodyValidator = body('links.*.uri').trim().isURL({
    allow_protocol_relative_urls: false,
    allow_trailing_dot: false,
    require_protocol: true,
    require_host: true,
    protocols: ['http', 'https'],
    disallow_auth: true,
}).withMessage('Not a valid URL');
const linkDescriptionBodyValidator = body('links.*.description').trim().isLength({min: 1}).withMessage('No description');

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
], isEditor, createConfigurationItem)
// Read

// Update

// Delete

// Check if can be deleted (no attributes exist)
router.get('/:id/CanDelete')

export default router;
