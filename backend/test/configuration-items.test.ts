import test from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { env } from '../src/config/env.js';
import { createApp } from '../src/app.js';

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

test('GET /api/v1/configuration-items returns the initial list', async () => {
  const response = await supertest(app)
    .get('/api/v1/configuration-items')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.length >= 2);
});

test('POST /api/v1/configuration-items creates a new item', async () => {
  const response = await supertest(app)
    .post('/api/v1/configuration-items')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Load-Balancer-01',
      type: 'network',
      status: 'active',
      description: 'Traffic balancing node',
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.name, 'Load-Balancer-01');
  assert.equal(response.body.type, 'network');
  assert.equal(response.body.status, 'active');
});

test('POST /api/v1/configuration-items rejects invalid input', async () => {
  const response = await supertest(app)
    .post('/api/v1/configuration-items')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: '',
      type: '',
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, 'Validation failed');
  assert.ok(Array.isArray(response.body.errors));
});
