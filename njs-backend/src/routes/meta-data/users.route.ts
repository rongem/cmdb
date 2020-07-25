import express from 'express';
import { body, param } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator } from '../validators';

const router = express.Router();

router.get('/');

router.get('/search/:text');

export default router;
