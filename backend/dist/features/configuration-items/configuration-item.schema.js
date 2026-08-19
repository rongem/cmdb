"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfigurationItemSchema = exports.createConfigurationItemSchema = void 0;
const zod_1 = require("zod");
exports.createConfigurationItemSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    type: zod_1.z.string().min(1).max(100),
    status: zod_1.z.enum(['draft', 'active', 'retired']).optional().default('draft'),
    description: zod_1.z.string().max(1000).optional(),
});
exports.updateConfigurationItemSchema = exports.createConfigurationItemSchema.partial().extend({
    id: zod_1.z.string().min(1),
});
