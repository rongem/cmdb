import express from 'express';
import { body, param } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator } from '../validators';
import {
    getConnectionTypes,
    getAllowedDownwardConnectionTypesByItemType,
} from '../../controllers/meta-data/connection-type.controller';

const router = express.Router();

router.get('/', getConnectionTypes);

router.get('/AllowedDownward/itemtype/:id', [idParamValidator], getAllowedDownwardConnectionTypesByItemType);

export default router;
