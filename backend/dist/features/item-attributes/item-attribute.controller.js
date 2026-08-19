"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemAttributeController = void 0;
const item_attribute_service_1 = require("./item-attribute.service");
const service = new item_attribute_service_1.ItemAttributeService();
class ItemAttributeController {
    async listByItemId(req, res, next) {
        try {
            const itemId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
            const attributes = await service.listByItemId(itemId);
            res.json(attributes);
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const attribute = await service.getById(id);
            if (!attribute) {
                res.status(404).json({ message: 'Item attribute not found' });
                return;
            }
            res.json(attribute);
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const attribute = await service.create(req.body);
            res.status(201).json(attribute);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const attribute = await service.update({ id, ...req.body });
            if (!attribute) {
                res.status(404).json({ message: 'Item attribute not found' });
                return;
            }
            res.json(attribute);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const deleted = await service.delete(id);
            if (!deleted) {
                res.status(404).json({ message: 'Item attribute not found' });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ItemAttributeController = ItemAttributeController;
