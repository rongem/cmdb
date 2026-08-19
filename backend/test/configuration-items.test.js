"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../src/config/env");
const app_1 = require("../src/app");
const app = (0, app_1.createApp)();
const token = jsonwebtoken_1.default.sign({
    sub: 'user-1',
    userName: 'demo-user',
    roles: ['admin'],
    tenantId: 'default',
}, env_1.env.JWT_SECRET, { expiresIn: '1h' });
(0, node_test_1.default)('GET /api/v1/configuration-items returns the initial list', async () => {
    const response = await (0, supertest_1.default)(app)
        .get('/api/v1/configuration-items')
        .set('Authorization', `Bearer ${token}`);
    strict_1.default.equal(response.status, 200);
    strict_1.default.ok(Array.isArray(response.body));
    strict_1.default.ok(response.body.length >= 2);
});
(0, node_test_1.default)('POST /api/v1/configuration-items creates a new item', async () => {
    const response = await (0, supertest_1.default)(app)
        .post('/api/v1/configuration-items')
        .set('Authorization', `Bearer ${token}`)
        .send({
        name: 'Load-Balancer-01',
        type: 'network',
        status: 'active',
        description: 'Traffic balancing node',
    });
    strict_1.default.equal(response.status, 201);
    strict_1.default.equal(response.body.name, 'Load-Balancer-01');
    strict_1.default.equal(response.body.type, 'network');
    strict_1.default.equal(response.body.status, 'active');
});
(0, node_test_1.default)('POST /api/v1/configuration-items rejects invalid input', async () => {
    const response = await (0, supertest_1.default)(app)
        .post('/api/v1/configuration-items')
        .set('Authorization', `Bearer ${token}`)
        .send({
        name: '',
        type: '',
    });
    strict_1.default.equal(response.status, 400);
    strict_1.default.equal(response.body.message, 'Validation failed');
    strict_1.default.ok(Array.isArray(response.body.errors));
});
