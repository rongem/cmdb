import express from 'express';

import { idParamValidator, validate } from '../validators';
import {
    getAttributeTypes,
    getAttributeTypesForAttributeGroup,
    getAttributeTypesForItemType,
} from '../../controllers/meta-data/attribute-type.controller';
import { idField } from '../../util/fields.constants';

const router = express.Router();

router.get('/', getAttributeTypes);

router.get(`/ForGroup/:${idField}`, [idParamValidator()], validate, getAttributeTypesForAttributeGroup);

router.get(`/ForItemType/:${idField}`, [idParamValidator()], validate, getAttributeTypesForItemType);

export default router;
