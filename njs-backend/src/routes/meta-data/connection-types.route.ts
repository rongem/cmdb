import express from 'express';

import { idParamValidator } from '../validators';
import {
    getConnectionTypes,
    getAllowedDownwardConnectionTypesByItemType,
} from '../../controllers/meta-data/connection-type.controller';
import { idField } from '../../util/fields.constants';

const router = express.Router();

router.get('/', getConnectionTypes);

router.get(`/AllowedDownward/itemtype/:${idField}`, [idParamValidator], getAllowedDownwardConnectionTypesByItemType);

export default router;
