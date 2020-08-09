import express from 'express';

import { idParamValidator } from '../validators';
import {
    getConnectionTypes,
    getAllowedDownwardConnectionTypesByItemType,
} from '../../controllers/meta-data/connection-type.controller';
import { id } from '../../util/fields.constants';

const router = express.Router();

router.get('/', getConnectionTypes);

router.get(`/AllowedDownward/itemtype/:${id}`, [idParamValidator], getAllowedDownwardConnectionTypesByItemType);

export default router;
