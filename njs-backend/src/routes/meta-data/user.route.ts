import express from 'express';
import { body, param } from 'express-validator';

import { isAdministrator } from '../../controllers/auth/authentication.controller';
import {
    getCurrentUser,
    getRoleForUser,
    deleteUser,
    updateUser,
    createUser,
} from '../../controllers/meta-data/user.controller';
import { domainField, nameField, roleField, withResponsibilitiesField } from '../../util/fields.constants';
import {
    invalidUserNameMsg,
    invalidRoleMsg,
    invalidDomainNameMsg,
    invalidResponsibilityFlagMsg,
} from '../../util/messages.constants';
import { stringExistsBodyValidator, stringExistsParamValidator, validate } from '../validators';

const router = express.Router();
const userNameBodyValidator = stringExistsBodyValidator(nameField, invalidUserNameMsg);
const userRoleBodyValidator = body(roleField, invalidRoleMsg).isInt({ allow_leading_zeroes: false, min: 0, max: 2 });
const userNameParamValidator = stringExistsParamValidator(nameField, invalidUserNameMsg);
const userRoleParamValidator = param(roleField, invalidRoleMsg).isInt({ allow_leading_zeroes: false, min: 0, max: 2 });
const domainParamValidator = stringExistsParamValidator(domainField, invalidDomainNameMsg);
const responsibilityParamValidator = param(withResponsibilitiesField, invalidResponsibilityFlagMsg).isBoolean();

// Create
router.post('/', [
    userNameBodyValidator,
    userRoleBodyValidator,
], isAdministrator, validate, createUser);

// Read
router.get('/Current', getCurrentUser);
router.get('/Role', getRoleForUser);

// Update
router.put('/', [
    userNameBodyValidator,
    userRoleBodyValidator,
], isAdministrator, validate, updateUser);

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
