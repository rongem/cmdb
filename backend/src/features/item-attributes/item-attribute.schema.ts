import { z } from 'zod';

const itemAttributeValueSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('string'), value: z.string().max(1000) }),
  z.object({ type: z.literal('int'), value: z.number().int() }),
  z.object({ type: z.literal('decimal'), value: z.number().finite() }),
  z.object({ type: z.literal('datetime'), value: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:?\d{2})?$/)) }),
  z.object({ type: z.literal('bool'), value: z.boolean() }),
  z.object({
    type: z.literal('enum'),
    value: z.string().min(1).max(200),
    enumValueId: z.number().int().positive().optional().nullable(),
  }),
]);

export const createItemAttributeSchema = z.object({
  itemId: z.string().min(1),
  key: z.string().min(1).max(100),
  value: itemAttributeValueSchema,
});

export const updateItemAttributeSchema = createItemAttributeSchema.partial().extend({
  id: z.string().min(1),
});
