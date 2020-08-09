import express from 'express';
import { body, param } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator } from '../validators';
import { isEditor } from '../../controllers/auth/authentication.controller';
import {
    id,
} from '../../util/fields.constants';

const router = express.Router();

router.post('/ConvertFileToTable');
router.post('/ImportDataTable');

export default router;
