import express from 'express';

import { getAttributeGroups } from '../controllers/attribute-groups.controller';

export const router = express.Router();

router.get('/', getAttributeGroups);
