import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { createApp } from '../src/app.js';
import { env } from '../src/config/env.js';

const app = createApp();
const token = jwt.sign(
  {
    sub: 'user-1',
    userName: 'demo-user',
    roles: ['admin'],
    tenantId: 'default',
  },
  env.JWT_SECRET,
  { expiresIn: '1h' },
);

test('GET /api/v1/items/:itemId/attributes returns attributes for an item', async () => {
  const response = await supertest(app)
    .get('/api/v1/items/ci-1001/attributes')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.some((attribute: { key: string }) => attribute.key === 'environment'));
});

test('POST /api/v1/attributes creates a typed attribute', async () => {
  const response = await supertest(app)
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

  assert.equal(response.status, 201);
  assert.equal(response.body.itemId, 'ci-1001');
  assert.equal(response.body.key, 'cost-center');
  assert.equal(response.body.value.type, 'string');
  assert.equal(response.body.value.value, 'IT-42');
});

test('POST /api/v1/attributes rejects invalid input', async () => {
  const response = await supertest(app)
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

  assert.equal(response.status, 400);
  assert.equal(response.body.message, 'Validation failed');
  assert.ok(Array.isArray(response.body.errors));
});
