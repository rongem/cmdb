"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const app_1 = require("../src/app");
const supertest_1 = __importDefault(require("supertest"));
(0, node_test_1.default)('GET /health returns ok', async () => {
    const app = (0, app_1.createApp)();
    const response = await (0, supertest_1.default)(app).get('/health');
    strict_1.default.equal(response.status, 200);
    strict_1.default.equal(response.body.status, 'ok');
});
