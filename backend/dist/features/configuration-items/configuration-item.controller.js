"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationItemController = void 0;
const configuration_item_service_1 = require("./configuration-item.service");
const service = new configuration_item_service_1.ConfigurationItemService();
class ConfigurationItemController {
    async list(_req, res, next) {
        try {
            const items = await service.list();
            res.json(items);
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const item = await service.getById(id);
            if (!item) {
                res.status(404).json({ message: 'Configuration item not found' });
                return;
            }
            res.json(item);
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const item = await service.create(req.body);
            res.status(201).json(item);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const item = await service.update({ id, ...req.body });
            if (!item) {
                res.status(404).json({ message: 'Configuration item not found' });
                return;
            }
            res.json(item);
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
                res.status(404).json({ message: 'Configuration item not found' });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ConfigurationItemController = ConfigurationItemController;
