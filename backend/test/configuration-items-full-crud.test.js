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
(0, node_test_1.default)('GET /api/v1/configuration-items/:id returns an item by id', async () => {
    const response = await (0, supertest_1.default)(app)
        .get('/api/v1/configuration-items/ci-1001')
        .set('Authorization', `Bearer ${token}`);
    strict_1.default.equal(response.status, 200);
    strict_1.default.equal(response.body.id, 'ci-1001');
    strict_1.default.equal(response.body.name, 'App-Server-01');
});
(0, node_test_1.default)('PUT /api/v1/configuration-items/:id updates an existing item', async () => {
    const response = await (0, supertest_1.default)(app)
        .put('/api/v1/configuration-items/ci-1001')
        .set('Authorization', `Bearer ${token}`)
        .send({
        name: 'App-Server-01-Updated',
        description: 'Updated application server description',
        status: 'retired',
    });
    strict_1.default.equal(response.status, 200);
    strict_1.default.equal(response.body.id, 'ci-1001');
    strict_1.default.equal(response.body.name, 'App-Server-01-Updated');
    strict_1.default.equal(response.body.status, 'retired');
});
(0, node_test_1.default)('DELETE /api/v1/configuration-items/:id removes an item', async () => {
    const created = await (0, supertest_1.default)(app)
        .post('/api/v1/configuration-items')
        .set('Authorization', `Bearer ${token}`)
        .send({
        name: 'Temporary-Item-For-Delete',
        type: 'service',
        status: 'draft',
        description: 'Will be deleted',
    });
    const response = await (0, supertest_1.default)(app)
        .delete(`/api/v1/configuration-items/${created.body.id}`)
        .set('Authorization', `Bearer ${token}`);
    strict_1.default.equal(response.status, 204);
});
(0, node_test_1.default)('GET /api/v1/configuration-items/:id returns 404 if item is missing', async () => {
    const response = await (0, supertest_1.default)(app)
        .get('/api/v1/configuration-items/ci-does-not-exist')
        .set('Authorization', `Bearer ${token}`);
    strict_1.default.equal(response.status, 404);
    strict_1.default.equal(response.body.message, 'Configuration item not found');
});
