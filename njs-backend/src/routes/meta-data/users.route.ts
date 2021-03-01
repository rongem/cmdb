import express from 'express';
import dotenv from 'dotenv';

import { getAllUsers, searchUsersInDataBase } from '../../controllers/meta-data/user.controller';
import endpointConfig from '../../util/endpoint.config';
import { stringExistsParamValidator, validate } from '../validators';
import { textField } from '../../util/fields.constants';
import { invalidSearchTextMsg, onlyAlphanumericMsg } from '../../util/messages.constants';

const router = express.Router();
const textParamValidator = stringExistsParamValidator(textField, invalidSearchTextMsg)
    .isAlphanumeric().withMessage(onlyAlphanumericMsg).toLowerCase();

router.get('/', getAllUsers);

// this redundant is done because the router is called before dotenv.config in app.ts
dotenv.config();

switch (endpointConfig.authMode()) {
    case 'ntlm':
        break;
    case 'jwt':
        router.get(`/search/:${textField}`, [textParamValidator], validate, searchUsersInDataBase);
        break;
    default:
        console.log('not found: ' + endpointConfig.authMode());
        break;
}

export default router;
