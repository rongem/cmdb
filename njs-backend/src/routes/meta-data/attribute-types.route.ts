import express from 'express';

import { idParamValidator, validate } from '../validators';
import {
    getAttributeTypes,
    getAttributeTypesForAttributeGroup,
    getAttributeTypesForItemType,
    getCorrespondingAttributeTypes,
} from '../../controllers/meta-data/attribute-types.controller';
import { idField } from '../../util/fields.constants';

const router = express.Router();

router.get('/', getAttributeTypes);

router.get(`/ForGroup/:${idField}`, [idParamValidator], validate, getAttributeTypesForAttributeGroup);

router.get(`/ForItemType/:${idField}`, [idParamValidator], validate, getAttributeTypesForItemType);

// prepare migrating by finding attributes with corresponding values
router.get(`/CorrespondingValuesOfType/:${idField}`, [idParamValidator], validate, getCorrespondingAttributeTypes);

export default router;
