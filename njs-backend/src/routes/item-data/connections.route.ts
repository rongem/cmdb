import express from 'express';
import { body, param } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator } from '../validators';
import {
    idField,
} from '../../util/fields.constants';
import { getConnections } from '../../controllers/item-data/connection.controller';

const router = express.Router();

// router.get('/', getConnections);

export default router;
