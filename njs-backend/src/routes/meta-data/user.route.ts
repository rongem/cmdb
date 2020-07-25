import express from 'express';
import { body, param } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator } from '../validators';

const router = express.Router();

// Create
router.post('/')

// Read
router.get('/Current');
router.get('/Role');

// Update
router.put('/');

// Delete
router.delete('/:domain/:name/:role/:withResponsibilities')
router.delete('/:name/:role/:withResponsibilities')

export default router;
