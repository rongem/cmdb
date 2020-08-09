import express from 'express';

import { idParamValidator, upperIdParamValidator, lowerIdParamValidator } from '../validators';
import {
    getConnectionRules,
    getConnectionRulesForItemType,
    getConnectionRulesForLowerItemType,
    getConnectionRulesForUpperAndLowerItemType,
    getConnectionRulesForUpperItemType,
} from '../../controllers/meta-data/connection-rules.controller';
import { id, lowerId, upperId } from '../../util/fields.constants';

const router = express.Router();

router.get('/', getConnectionRules);

router.get(`/ForItemType/:${id}`, [idParamValidator], getConnectionRulesForItemType);

router.get(`/ForUpperItemType/:${upperId}/ForLowerItemType/:${lowerId}`, [
    upperIdParamValidator,
    lowerIdParamValidator,
], getConnectionRulesForUpperAndLowerItemType);

router.get(`/ForUpperItemType/:${id}`, [idParamValidator], getConnectionRulesForUpperItemType);

router.get(`/ForLowerItemType/:${id}`, [idParamValidator], getConnectionRulesForLowerItemType);

export default router;
