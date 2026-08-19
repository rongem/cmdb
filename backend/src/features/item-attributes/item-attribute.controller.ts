import { NextFunction, Request, Response } from 'express';
import { ItemAttributeService } from './item-attribute.service';

const service = new ItemAttributeService();

export class ItemAttributeController {
  async listByItemId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const itemId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
      const attributes = await service.listByItemId(itemId);
      res.json(attributes);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const attribute = await service.getById(id);
      if (!attribute) {
        res.status(404).json({ message: 'Item attribute not found' });
        return;
      }

      res.json(attribute);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const attribute = await service.create(req.body);
      res.status(201).json(attribute);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const attribute = await service.update({ id, ...req.body });
      if (!attribute) {
        res.status(404).json({ message: 'Item attribute not found' });
        return;
      }

      res.json(attribute);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const deleted = await service.delete(id);
      if (!deleted) {
        res.status(404).json({ message: 'Item attribute not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
