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

const router = express.Router();
const userNameBodyValidator = body('name').trim().isLength({min: 1}).withMessage('No user name.');
const userRoleBodyValidator = body('role').isInt({allow_leading_zeroes: false, min: 0, max: 2}).withMessage('No valid role.');
const userNameParamValidator = param('name').trim().isLength({min: 1}).withMessage('No user name.');
const userRoleParamValidator = param('role').isInt({allow_leading_zeroes: false, min: 0, max: 2}).withMessage('No valid role.');
const domainParamValidator = param('domain').trim().isLength({min: 1}).withMessage('No domain.');
const responsibilityParamValidator = param('withResponsibilities').isBoolean().withMessage('No valid flag for deleting with or without responsibilities.');

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
router.delete('/:domain/:name/:role/:withResponsibilities', [
    userNameParamValidator,
    domainParamValidator,
    userRoleParamValidator,
    responsibilityParamValidator,
], isAdministrator, deleteUser);
router.delete('/:name/:role/:withResponsibilities', [
    userNameParamValidator,
    userRoleParamValidator,
    responsibilityParamValidator,
], isAdministrator, deleteUser);

export default router;
