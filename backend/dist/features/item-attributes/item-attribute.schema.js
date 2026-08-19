"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateItemAttributeSchema = exports.createItemAttributeSchema = void 0;
const zod_1 = require("zod");
const itemAttributeValueSchema = zod_1.z.discriminatedUnion('type', [
    zod_1.z.object({ type: zod_1.z.literal('string'), value: zod_1.z.string().max(1000) }),
    zod_1.z.object({ type: zod_1.z.literal('int'), value: zod_1.z.number().int() }),
    zod_1.z.object({ type: zod_1.z.literal('decimal'), value: zod_1.z.number().finite() }),
    zod_1.z.object({ type: zod_1.z.literal('datetime'), value: zod_1.z.string().datetime({ offset: true }).or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:?\d{2})?$/)) }),
    zod_1.z.object({ type: zod_1.z.literal('bool'), value: zod_1.z.boolean() }),
    zod_1.z.object({
        type: zod_1.z.literal('enum'),
        value: zod_1.z.string().min(1).max(200),
        enumValueId: zod_1.z.number().int().positive().optional().nullable(),
    }),
]);
exports.createItemAttributeSchema = zod_1.z.object({
    itemId: zod_1.z.string().min(1),
    key: zod_1.z.string().min(1).max(100),
    value: itemAttributeValueSchema,
});
exports.updateItemAttributeSchema = exports.createItemAttributeSchema.partial().extend({
    id: zod_1.z.string().min(1),
});
