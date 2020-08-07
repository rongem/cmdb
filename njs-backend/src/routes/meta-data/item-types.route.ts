import express from 'express';
import { param } from 'express-validator';

import { idParamValidator } from '../validators';
import {
    getItemTypes,
    getItemTypesForUpperItemTypeAndConnection,
    getItemTypesForLowerItemTypeAndConnection,
    getItemTypesByAllowedAttributeType,
} from '../../controllers/meta-data/item-type.controller';

const router = express.Router();
const connectionTypeParamValidator = param('connectionType').trim().isMongoId().withMessage('No valid connection type.');

router.get("/", getItemTypes);

router.get('/ForUppper/:id/ConnectionType/:connectionType', [
    idParamValidator, connectionTypeParamValidator
], getItemTypesForUpperItemTypeAndConnection);

router.get('/ForLower/:id/ConnectionType/:connectionType', [
    idParamValidator, connectionTypeParamValidator
], getItemTypesForLowerItemTypeAndConnection);

router.get('/ByAllowedAttributeType/:id', [idParamValidator], getItemTypesByAllowedAttributeType);

export default router;
