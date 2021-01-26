import express from 'express';
import { getMetaData } from '../../controllers/meta-data/meta-data.controller';

const router = express.Router();

router.get('/', getMetaData);

export default router;
