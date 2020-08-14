import express from 'express';
import { body } from 'express-validator';

import {
    getAttributeGroups,
    getAttributeGroupsInItemType,
    getAttributeGroupsNotInItemType
} from '../../controllers/meta-data/attribute-group.controller';
import { idParamValidator, validate } from '../validators';
import { idField } from '../../util/fields.constants';

const router = express.Router();

router.get('/', getAttributeGroups);

router.get(`/InItemType/:${idField}`, [idParamValidator], validate, getAttributeGroupsInItemType);

router.get(`/NotInItemType/:${idField}`, [idParamValidator], validate, getAttributeGroupsNotInItemType);

export default router;
