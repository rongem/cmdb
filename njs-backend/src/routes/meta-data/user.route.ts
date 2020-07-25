import express from 'express';
import { body, param } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator } from '../validators';
import { isAdministrator } from '../../controllers/auth/authentication.controller';

const router = express.Router();

// Create
router.post('/', isAdministrator);

// Read
router.get('/Current');
router.get('/Role');

// Update
router.put('/', isAdministrator);

// Delete
router.delete('/:domain/:name/:role/:withResponsibilities', isAdministrator);
router.delete('/:name/:role/:withResponsibilities', isAdministrator);

export default router;
