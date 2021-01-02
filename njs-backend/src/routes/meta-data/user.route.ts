import express from 'express';
import { body, param } from 'express-validator';

import { isAdministrator } from '../../controllers/auth/authentication.controller';
import {
    getCurrentUser,
    getRoleForUser,
    deleteUser,
    updateUser,
    createUser,
    updateUserPassword as updateUserPassphrase,
} from '../../controllers/meta-data/user.controller';
import { domainField, nameField, roleField, withResponsibilitiesField, accountNameField, passphraseField } from '../../util/fields.constants';
import {
    invalidUserNameMsg,
    invalidRoleMsg,
    invalidDomainNameMsg,
    invalidResponsibilityFlagMsg,
    invalidPassphraseMsg,
} from '../../util/messages.constants';
import { stringExistsBodyValidator, stringExistsParamValidator, validate } from '../validators';
import endpoint from '../../util/endpoint.config';

const router = express.Router();
const userNameBodyValidator = stringExistsBodyValidator(accountNameField, invalidUserNameMsg);
const userRoleBodyValidator = body(roleField, invalidRoleMsg).isInt({ allow_leading_zeroes: false, min: 0, max: 2 });
const userNameParamValidator = stringExistsParamValidator(accountNameField, invalidUserNameMsg);
const userRoleParamValidator = param(roleField, invalidRoleMsg).isInt({ allow_leading_zeroes: false, min: 0, max: 2 });
const domainParamValidator = stringExistsParamValidator(domainField, invalidDomainNameMsg);
const responsibilityParamValidator = param(withResponsibilitiesField, invalidResponsibilityFlagMsg).isBoolean();
const conditionedUserPassphraseBodyValidator = body(passphraseField).if(body(passphraseField).exists()).isStrongPassword();
const userPassphraseBodyValidator = body(passphraseField, invalidPassphraseMsg).trim().isStrongPassword();

// Create
router.post('/', [
    userNameBodyValidator,
    userRoleBodyValidator,
    conditionedUserPassphraseBodyValidator,
], isAdministrator, validate, createUser);

// Read
router.get('/Current', getCurrentUser);
router.get('/Role', getRoleForUser);

// Update
router.put('/', [
    userNameBodyValidator,
    userRoleBodyValidator,
    conditionedUserPassphraseBodyValidator,
], isAdministrator, validate, updateUser);

if (endpoint.authMode() === 'jwt') {
    router.patch('/passphrase', [
        userPassphraseBodyValidator,
    ], validate, updateUserPassphrase);
}

// Delete
router.delete(`/:${domainField}/:${nameField}/:${roleField}/:${withResponsibilitiesField}`, [
    userNameParamValidator,
    domainParamValidator,
    userRoleParamValidator,
    responsibilityParamValidator,
], isAdministrator, validate, deleteUser);
router.delete(`/:${nameField}/:${roleField}/:${withResponsibilitiesField}`, [
    userNameParamValidator,
    userRoleParamValidator,
    responsibilityParamValidator,
], isAdministrator, validate, deleteUser);

export default router;
