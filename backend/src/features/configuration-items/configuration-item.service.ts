import { z } from 'zod';
import { createConfigurationItemSchema, updateConfigurationItemSchema } from './configuration-item.schema';
import { configurationItemRepository } from './configuration-item.repository';
import { ConfigurationItem, CreateConfigurationItemInput, UpdateConfigurationItemInput } from './configuration-item.types';

export class ConfigurationItemService {
  async list(): Promise<ConfigurationItem[]> {
    return configurationItemRepository.list();
  }

  async getById(id: string): Promise<ConfigurationItem | undefined> {
    return configurationItemRepository.getById(id);
  }

  async create(input: unknown): Promise<ConfigurationItem> {
    const parsed = createConfigurationItemSchema.parse(input) as CreateConfigurationItemInput;
    return configurationItemRepository.create(parsed);
  }

  async update(input: unknown): Promise<ConfigurationItem | undefined> {
    const parsed = updateConfigurationItemSchema.parse(input) as UpdateConfigurationItemInput;
    return configurationItemRepository.update(parsed);
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

    return configurationItemRepository.delete(id);
  }
}
