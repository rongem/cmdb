import express from 'express';
import { body, param } from 'express-validator';

import { namedObjectUpdateValidators, idParamValidator, validate } from '../validators';
import { isEditor } from '../../controllers/auth/authentication.controller';
import {
    idField, upperItemField, connectionTypeField, lowerItemField,
} from '../../util/fields.constants';
import {
    getConnection,
    getConnectionByContent,
    createConnection,
    updateConnection,
    deleteConnection,
} from '../../controllers/item-data/connection.controller';

const router = express.Router();

// Create
router.post(`/`, [], validate, createConnection);

// Read
router.get(`/:${idField}`, [idParamValidator], validate, getConnection);

router.get(`Connection/upperItem/:${upperItemField}/connectionType/:${connectionTypeField}/lowerItem/:${lowerItemField}`,
    [], validate, getConnectionByContent);

// Update
router.put(`/:${idField}`, [idParamValidator], validate, updateConnection);

// Delete
router.delete(`/:${idField}`, [idParamValidator], validate, deleteConnection);

export default router;
