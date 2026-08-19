import { NextFunction, Request, Response } from 'express';
import { ConfigurationItemService } from './configuration-item.service';

const service = new ConfigurationItemService();

export class ConfigurationItemController {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items = await service.list();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const item = await service.getById(id);
      if (!item) {
        res.status(404).json({ message: 'Configuration item not found' });
        return;
      }

      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await service.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const item = await service.update({ id, ...req.body });
      if (!item) {
        res.status(404).json({ message: 'Configuration item not found' });
        return;
      }

      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const deleted = await service.delete(id);
      if (!deleted) {
        res.status(404).json({ message: 'Configuration item not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
