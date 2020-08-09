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
import { domain, name, role, withResponsibilities } from '../../util/fields.constants';
import { invalidUserName, invalidRole, invalidDomainName, invalidResponsibilityFlag } from '../../util/messages.constants';

const router = express.Router();
const userNameBodyValidator = body(name, invalidUserName).trim().isLength({min: 1});
const userRoleBodyValidator = body(role, invalidRole).isInt({allow_leading_zeroes: false, min: 0, max: 2});
const userNameParamValidator = param(name, invalidUserName).trim().isLength({min: 1});
const userRoleParamValidator = param(role, invalidRole).isInt({allow_leading_zeroes: false, min: 0, max: 2});
const domainParamValidator = param(domain, invalidDomainName).trim().isLength({min: 1});
const responsibilityParamValidator = param(withResponsibilities, invalidResponsibilityFlag).isBoolean();

// Create
router.post('/', [
    userNameBodyValidator,
    userRoleBodyValidator,
], isAdministrator, createUser);

// Read
router.get('/Current', getCurrentUser);
router.get('/Role', getRoleForUser);

// Update
router.put('/', [
    userNameBodyValidator,
    userRoleBodyValidator,
], isAdministrator, updateUser);

// Delete
router.delete(`/:${domain}/:${name}/:${role}/:${withResponsibilities}`, [
    userNameParamValidator,
    domainParamValidator,
    userRoleParamValidator,
    responsibilityParamValidator,
], isAdministrator, deleteUser);
router.delete(`/:${name}/:${role}/:${withResponsibilities}`, [
    userNameParamValidator,
    userRoleParamValidator,
    responsibilityParamValidator,
], isAdministrator, deleteUser);

export default router;
