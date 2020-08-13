import express from 'express';

import { getAllUsers, searchUsersInDataBase } from '../../controllers/meta-data/user.controller';
import endpointConfig from '../../util/endpoint.config';
import { stringExistsParamValidator, validate } from '../validators';
import { textField } from '../../util/fields.constants';
import { invalidSearchTextMsg, onlyAlphanumericMsg } from '../../util/messages.constants';

const router = express.Router();
const textParamValidator = stringExistsParamValidator(textField, invalidSearchTextMsg)
    .isAlphanumeric().withMessage(onlyAlphanumericMsg);

router.get('/', getAllUsers);

switch (endpointConfig.authMode()) {
    case 'ntlm':
        router.get(`/search/:${textField}`, [textParamValidator], validate, searchUsersInDataBase);
        break;
    default:
        console.log('not found: ' + endpointConfig.authMode());
        break;
}

export default router;
