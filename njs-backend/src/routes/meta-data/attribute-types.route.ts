import express from 'express';
import { body, param } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator } from '../validators';
import { getAttributeTypes } from '../../controllers/meta-data/attribute-types.controller';

const router = express.Router();

router.get('/', getAttributeTypes);

export default router;
