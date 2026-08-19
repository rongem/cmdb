"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemAttributeService = void 0;
const zod_1 = require("zod");
const item_attribute_schema_1 = require("./item-attribute.schema");
const item_attribute_repository_1 = require("./item-attribute.repository");
class ItemAttributeService {
    async listByItemId(itemId) {
        return item_attribute_repository_1.itemAttributeRepository.listByItemId(itemId);
    }
    async getById(id) {
        return item_attribute_repository_1.itemAttributeRepository.getById(id);
    }
    async create(input) {
        const parsed = item_attribute_schema_1.createItemAttributeSchema.parse(input);
        return item_attribute_repository_1.itemAttributeRepository.create(parsed);
    }
    async update(input) {
        const parsed = item_attribute_schema_1.updateItemAttributeSchema.parse(input);
        return item_attribute_repository_1.itemAttributeRepository.update(parsed);
    }
    async delete(id) {
        if (!id || id.trim().length === 0) {
            throw new zod_1.z.ZodError([
                {
                    code: 'invalid_type',
                    expected: 'string',
                    received: typeof id,
                    path: ['id'],
                    message: 'id is required',
                },
            ]);
        }
        return item_attribute_repository_1.itemAttributeRepository.delete(id);
    }
}
exports.ItemAttributeService = ItemAttributeService;
