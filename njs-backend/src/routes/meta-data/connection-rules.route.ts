import express from 'express';

import { idParamValidator, upperIdParamValidator, lowerIdParamValidator, validate } from '../validators';
import {
    getConnectionRules,
    getConnectionRulesForItemType,
    getConnectionRulesForLowerItemType,
    getConnectionRulesForUpperAndLowerItemType,
    getConnectionRulesForUpperItemType,
} from '../../controllers/meta-data/connection-rule.controller';
import { idField, lowerIdField, upperIdField } from '../../util/fields.constants';

const router = express.Router();

router.get('/', getConnectionRules);

router.get(`/ForItemType/:${idField}`, [idParamValidator()], validate, getConnectionRulesForItemType);

router.get(`/ForUpperItemType/:${upperIdField}/ForLowerItemType/:${lowerIdField}`, [
    upperIdParamValidator,
    lowerIdParamValidator,
], validate, getConnectionRulesForUpperAndLowerItemType);

router.get(`/ForUpperItemType/:${idField}`, [idParamValidator()], validate, getConnectionRulesForUpperItemType);

router.get(`/ForLowerItemType/:${idField}`, [idParamValidator()], validate, getConnectionRulesForLowerItemType);

export default router;
