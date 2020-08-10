import express from 'express';

import { idParamValidator } from '../validators';
import {
    getAttributeTypes,
    getAttributeTypesForAttributeGroup,
    getAttributeTypesForItemType,
    getCorrespondingAttributeTypes,
} from '../../controllers/meta-data/attribute-types.controller';
import { idField } from '../../util/fields.constants';

const router = express.Router();

router.get('/', getAttributeTypes);

router.get(`/ForGroup/:${idField}`, [idParamValidator], getAttributeTypesForAttributeGroup);

router.get(`/ForItemType/:${idField}`, [idParamValidator], getAttributeTypesForItemType);

// prepare migrating by finding attributes with corresponding values
router.get(`/CorrespondingValuesOfType/:${idField}`, [idParamValidator], getCorrespondingAttributeTypes);

export default router;
