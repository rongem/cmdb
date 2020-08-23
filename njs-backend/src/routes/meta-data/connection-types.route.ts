import express from 'express';

import { idParamValidator, validate } from '../validators';
import {
    getConnectionTypes,
    getAllowedDownwardConnectionTypesByItemType,
} from '../../controllers/meta-data/connection-type.controller';
import { idField } from '../../util/fields.constants';

const router = express.Router();

router.get('/', getConnectionTypes);

router.get(`/AllowedDownward/itemtype/:${idField}`, [idParamValidator()], validate, getAllowedDownwardConnectionTypesByItemType);

export default router;
