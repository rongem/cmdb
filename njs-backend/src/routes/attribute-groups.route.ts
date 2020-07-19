import express from 'express';
import { check } from 'express-validator/check';

import { getAttributeGroups } from '../controllers/attribute-groups.controller';

export const router = express.Router();

router.get('/', getAttributeGroups);
