import express from 'express';
import { body, param } from 'express-validator';

import { getAllUsers, searchUsersInDataBase } from '../../controllers/meta-data/user.controller';
import endpointConfig from '../../util/endpoint.config';

const router = express.Router();
const textParamValidator = param('text').trim().isLength({min: 1}).withMessage('No valid search text.')
    .isAlphanumeric().withMessage('Only characters and numbers are allowed');

router.get('/', getAllUsers);

switch (endpointConfig.authMode()) {
    case 'ntlm':
        router.get('/search/:text', [textParamValidator], searchUsersInDataBase);
        break;
    default:
        console.log('not found: ' + endpointConfig.authMode());
        break;
}

export default router;
