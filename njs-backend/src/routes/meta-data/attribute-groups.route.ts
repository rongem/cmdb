import express from 'express';
import { body } from 'express-validator';

import {
    getAttributeGroups,
    getAttributeGroupsInItemType,
    getAttributeGroupsNotInItemType
} from '../../controllers/meta-data/attribute-groups.controller';
import { idParamValidator } from '../validators';
import { idField } from '../../util/fields.constants';

const router = express.Router();

router.get('/', getAttributeGroups);

router.get(`/InItemType/:${idField}`, [idParamValidator], getAttributeGroupsInItemType);

router.get(`/NotInItemType/:${idField}`, [idParamValidator], getAttributeGroupsNotInItemType);

export default router;
