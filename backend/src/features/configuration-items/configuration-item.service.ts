import { z } from 'zod';
import { createConfigurationItemSchema, updateConfigurationItemSchema } from './configuration-item.schema.js';
import { configurationItemRepository } from './configuration-item.repository.js';
import type { ConfigurationItem, CreateConfigurationItemInput, UpdateConfigurationItemInput } from './configuration-item.types.js';

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
    z.string().trim().min(1).parse(id);
    return configurationItemRepository.delete(id);
  }
}
