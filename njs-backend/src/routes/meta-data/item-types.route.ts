import express from 'express';

import { idParamValidator, mongoIdParamValidator } from '../validators';
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

router.get("/", getItemTypes);

router.get(`/ForUppper/:${idField}/ConnectionType/:${connectionTypeField}`, [
    idParamValidator, connectionTypeParamValidator
], getItemTypesForUpperItemTypeAndConnection);

router.get(`/ForLower/:${idField}/ConnectionType/:${connectionTypeField}`, [
    idParamValidator, connectionTypeParamValidator
], getItemTypesForLowerItemTypeAndConnection);

router.get(`/ByAllowedAttributeType/:${idField}`, [idParamValidator], getItemTypesByAllowedAttributeType);

export default router;
