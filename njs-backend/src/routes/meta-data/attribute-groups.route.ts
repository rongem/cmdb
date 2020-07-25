import express from 'express';
import { body } from 'express-validator';

import {
    getAttributeGroups,
    getAttributeGroupsInItemType,
    getAttributeGroupsNotInItemType
} from '../../controllers/meta-data/attribute-groups.controller';
import { idParamValidator } from '../validators';

const router = express.Router();

router.get('/', getAttributeGroups);

router.get('/InItemType/:id', [idParamValidator], getAttributeGroupsInItemType);

router.get('/NotInItemType/:id', [idParamValidator], getAttributeGroupsNotInItemType);

export default router;
