import { Router } from 'express';
import { ConfigurationItemController } from '../features/configuration-items/configuration-item.controller.js';

const router = Router();
const controller = new ConfigurationItemController();

router.get('/', controller.list.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
