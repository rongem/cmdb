import express from 'express';
import { body, param } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator } from '../validators';

const router = express.Router();

router.post('/ConvertFileToTable');
router.post('/ImportDataTable');

export default router;
