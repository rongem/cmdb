import { Router } from 'express';
import { ItemAttributeController } from '../features/item-attributes/item-attribute.controller.js';

const router = Router();
const controller = new ItemAttributeController();

router.get('/items/:itemId/attributes', controller.listByItemId.bind(controller));
router.get('/attributes/:id', controller.getById.bind(controller));
router.post('/attributes', controller.create.bind(controller));
router.put('/attributes/:id', controller.update.bind(controller));
router.delete('/attributes/:id', controller.delete.bind(controller));

export default router;
