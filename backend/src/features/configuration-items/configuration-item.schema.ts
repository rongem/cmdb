import { z } from 'zod';

export const createConfigurationItemSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.string().min(1).max(100),
  status: z.enum(['draft', 'active', 'retired']).optional().default('draft'),
  description: z.string().max(1000).optional(),
});

export const updateConfigurationItemSchema = createConfigurationItemSchema.partial().extend({
  id: z.string().min(1),
});
