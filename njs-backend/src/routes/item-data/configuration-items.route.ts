import express from 'express';
import { body, param } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator } from '../validators';
import { id } from '../../util/fields.constants';

const router = express.Router();

export default router;
