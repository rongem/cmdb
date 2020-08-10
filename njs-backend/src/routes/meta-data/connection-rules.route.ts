import express from 'express';

import { idParamValidator, upperIdParamValidator, lowerIdParamValidator } from '../validators';
import {
    getConnectionRules,
    getConnectionRulesForItemType,
    getConnectionRulesForLowerItemType,
    getConnectionRulesForUpperAndLowerItemType,
    getConnectionRulesForUpperItemType,
} from '../../controllers/meta-data/connection-rules.controller';
import { idField, lowerIdField, upperIdField } from '../../util/fields.constants';

const router = express.Router();

router.get('/', getConnectionRules);

router.get(`/ForItemType/:${idField}`, [idParamValidator], getConnectionRulesForItemType);

router.get(`/ForUpperItemType/:${upperIdField}/ForLowerItemType/:${lowerIdField}`, [
    upperIdParamValidator,
    lowerIdParamValidator,
], getConnectionRulesForUpperAndLowerItemType);

router.get(`/ForUpperItemType/:${idField}`, [idParamValidator], getConnectionRulesForUpperItemType);

router.get(`/ForLowerItemType/:${idField}`, [idParamValidator], getConnectionRulesForLowerItemType);

export default router;
