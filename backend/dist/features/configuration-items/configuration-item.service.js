"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationItemService = void 0;
const zod_1 = require("zod");
const configuration_item_schema_1 = require("./configuration-item.schema");
const configuration_item_repository_1 = require("./configuration-item.repository");
class ConfigurationItemService {
    async list() {
        return configuration_item_repository_1.configurationItemRepository.list();
    }
    async getById(id) {
        return configuration_item_repository_1.configurationItemRepository.getById(id);
    }
    async create(input) {
        const parsed = configuration_item_schema_1.createConfigurationItemSchema.parse(input);
        return configuration_item_repository_1.configurationItemRepository.create(parsed);
    }
    async update(input) {
        const parsed = configuration_item_schema_1.updateConfigurationItemSchema.parse(input);
        return configuration_item_repository_1.configurationItemRepository.update(parsed);
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
        return configuration_item_repository_1.configurationItemRepository.delete(id);
    }
}
exports.ConfigurationItemService = ConfigurationItemService;
