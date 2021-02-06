import express from 'express';
import { getTextProposals } from '../../controllers/item-data/configuration-item.controller';

import {
    textField,
} from '../../util/fields.constants';
import { invalidTextMsg } from '../../util/messages.constants';
import { regexParamValidator, validate } from '../validators';

const router = express.Router();

router.get(`/:${textField}`, [
    regexParamValidator(textField, invalidTextMsg)
], validate, getTextProposals);

export default router;
