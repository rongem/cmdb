import { z } from 'zod';
import { createItemAttributeSchema, updateItemAttributeSchema } from './item-attribute.schema';
import { itemAttributeRepository } from './item-attribute.repository';
import { CreateItemAttributeInput, ItemAttribute, UpdateItemAttributeInput } from './item-attribute.types';

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
    if (!id || id.trim().length === 0) {
      throw new z.ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: typeof id,
          path: ['id'],
          message: 'id is required',
        },
      ]);
    }

    return itemAttributeRepository.delete(id);
  }
}
