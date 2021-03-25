import express from 'express';

import { getConnections } from '../../controllers/item-data/connection.controller';

const router = express.Router();

router.get('/', getConnections);

export default router;
