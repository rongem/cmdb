import express from 'express';

import { idParamValidator, mongoIdParamValidator, validate } from '../validators';
import {
    getItemTypes,
    getItemTypesForUpperItemTypeAndConnection,
    getItemTypesForLowerItemTypeAndConnection,
    getItemTypesByAllowedAttributeType,
} from '../../controllers/meta-data/item-type.controller';
import { idField, connectionTypeField } from '../../util/fields.constants';
import { invalidConnectionTypeMsg } from '../../util/messages.constants';

const router = express.Router();
const connectionTypeParamValidator = mongoIdParamValidator(connectionTypeField, invalidConnectionTypeMsg);

router.get('/', getItemTypes);

router.get(`/ForUpper/:${idField}/ConnectionType/:${connectionTypeField}`, [
    idParamValidator(), connectionTypeParamValidator
], validate, getItemTypesForUpperItemTypeAndConnection);

router.get(`/ForLower/:${idField}/ConnectionType/:${connectionTypeField}`, [
    idParamValidator(), connectionTypeParamValidator
], validate, getItemTypesForLowerItemTypeAndConnection);

router.get(`/ByAllowedAttributeType/:${idField}`, [idParamValidator()], validate, getItemTypesByAllowedAttributeType);

export default router;
