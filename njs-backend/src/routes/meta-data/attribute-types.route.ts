import express from 'express';

import { idParamValidator } from '../validators';
import {
    getAttributeTypes,
    getAttributeTypesForAttributeGroup,
    getAttributeTypesForItemType,
    getCorrespondingAttributeTypes,
} from '../../controllers/meta-data/attribute-types.controller';
import { id } from '../../util/fields.constants';

const router = express.Router();

router.get('/', getAttributeTypes);

router.get(`/ForGroup/:${id}`, [idParamValidator], getAttributeTypesForAttributeGroup);

router.get(`/ForItemType/:${id}`, [idParamValidator], getAttributeTypesForItemType);

// prepare migrating by finding attributes with corresponding values
router.get(`/CorrespondingValuesOfType/:${id}`, [idParamValidator], getCorrespondingAttributeTypes);

export default router;
