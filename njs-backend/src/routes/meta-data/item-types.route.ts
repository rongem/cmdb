import express from 'express';

import { idParamValidator, mongoIdParamValidator } from '../validators';
import {
    getItemTypes,
    getItemTypesForUpperItemTypeAndConnection,
    getItemTypesForLowerItemTypeAndConnection,
    getItemTypesByAllowedAttributeType,
} from '../../controllers/meta-data/item-type.controller';
import { id, connectionType } from '../../util/fields.constants';
import { invalidConnectionType } from '../../util/messages.constants';

const router = express.Router();
const connectionTypeParamValidator = mongoIdParamValidator(connectionType, invalidConnectionType);

router.get("/", getItemTypes);

router.get(`/ForUppper/:${id}/ConnectionType/:${connectionType}`, [
    idParamValidator, connectionTypeParamValidator
], getItemTypesForUpperItemTypeAndConnection);

router.get(`/ForLower/:${id}/ConnectionType/:${connectionType}`, [
    idParamValidator, connectionTypeParamValidator
], getItemTypesForLowerItemTypeAndConnection);

router.get(`/ByAllowedAttributeType/:${id}`, [idParamValidator], getItemTypesByAllowedAttributeType);

export default router;
