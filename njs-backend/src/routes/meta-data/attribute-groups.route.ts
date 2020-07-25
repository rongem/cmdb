import express from 'express';
import { body } from 'express-validator';

import { getAttributeGroups } from '../../controllers/meta-data/attribute-groups.controller';

const router = express.Router();

router.get('/', getAttributeGroups);

router.get('/InItemType/:id', );

router.get('/NotInItemType/:id', );

export default router;
