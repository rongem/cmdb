"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const env_1 = require("../src/config/env");
const app = (0, app_1.createApp)();
const token = jsonwebtoken_1.default.sign({
    sub: 'user-1',
    userName: 'demo-user',
    roles: ['admin'],
    tenantId: 'default',
}, env_1.env.JWT_SECRET, { expiresIn: '1h' });
(0, node_test_1.default)('GET /api/v1/items/:itemId/attributes returns attributes for an item', async () => {
    const response = await (0, supertest_1.default)(app)
        .get('/api/v1/items/ci-1001/attributes')
        .set('Authorization', `Bearer ${token}`);
    strict_1.default.equal(response.status, 200);
    strict_1.default.ok(Array.isArray(response.body));
    strict_1.default.ok(response.body.some((attribute) => attribute.key === 'environment'));
});
(0, node_test_1.default)('POST /api/v1/attributes creates a typed attribute', async () => {
    const response = await (0, supertest_1.default)(app)
        .post('/api/v1/attributes')
        .set('Authorization', `Bearer ${token}`)
        .send({
        itemId: 'ci-1001',
        key: 'cost-center',
        value: {
            type: 'string',
            value: 'IT-42',
        },
    });
    strict_1.default.equal(response.status, 201);
    strict_1.default.equal(response.body.itemId, 'ci-1001');
    strict_1.default.equal(response.body.key, 'cost-center');
    strict_1.default.equal(response.body.value.type, 'string');
    strict_1.default.equal(response.body.value.value, 'IT-42');
});
(0, node_test_1.default)('POST /api/v1/attributes rejects invalid input', async () => {
    const response = await (0, supertest_1.default)(app)
        .post('/api/v1/attributes')
        .set('Authorization', `Bearer ${token}`)
        .send({
        itemId: '',
        key: '',
        value: {
            type: 'string',
            value: '',
        },
    });
    strict_1.default.equal(response.status, 400);
    strict_1.default.equal(response.body.message, 'Validation failed');
    strict_1.default.ok(Array.isArray(response.body.errors));
});
