import { z } from 'zod';
import { createItemAttributeSchema, updateItemAttributeSchema } from './item-attribute.schema.js';
import { itemAttributeRepository } from './item-attribute.repository.js';
import type { CreateItemAttributeInput, ItemAttribute, UpdateItemAttributeInput } from './item-attribute.types.js';

export class ItemAttributeService {
  async listByItemId(itemId: string): Promise<ItemAttribute[]> {
    return itemAttributeRepository.listByItemId(itemId);
  }

  async getById(id: string): Promise<ItemAttribute | undefined> {
    return itemAttributeRepository.getById(id);
  }

  async create(input: unknown): Promise<ItemAttribute> {
    const parsed = createItemAttributeSchema.parse(input) as CreateItemAttributeInput;
    return itemAttributeRepository.create(parsed);
  }

  async update(input: unknown): Promise<ItemAttribute | undefined> {
    const parsed = updateItemAttributeSchema.parse(input) as UpdateItemAttributeInput;
    return itemAttributeRepository.update(parsed);
  }

  async delete(id: string): Promise<boolean> {
    z.string().trim().min(1).parse(id);
    return itemAttributeRepository.delete(id);
  }
}
