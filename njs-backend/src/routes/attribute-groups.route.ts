import express from 'express';
import { check } from 'express-validator/check';

import { getAttributeGroups } from '../controllers/attribute-groups.controller';

const router = express.Router();

router.get('/', getAttributeGroups);

router.get('/InItemType/:id', );

router.get('/NotInItemType/:id', );

export default router;
