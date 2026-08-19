import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { createApp } from '../src/app';
import { env } from '../src/config/env';

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

test('GET /api/v1/configuration-items/:id returns an item by id', async () => {
  const response = await supertest(app)
    .get('/api/v1/configuration-items/ci-1001')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.id, 'ci-1001');
  assert.equal(response.body.name, 'App-Server-01');
});

test('PUT /api/v1/configuration-items/:id updates an existing item', async () => {
  const response = await supertest(app)
    .put('/api/v1/configuration-items/ci-1001')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'App-Server-01-Updated',
      description: 'Updated application server description',
      status: 'retired',
    });

  assert.equal(response.status, 200);
  assert.equal(response.body.id, 'ci-1001');
  assert.equal(response.body.name, 'App-Server-01-Updated');
  assert.equal(response.body.status, 'retired');
});

test('DELETE /api/v1/configuration-items/:id removes an item', async () => {
  const created = await supertest(app)
    .post('/api/v1/configuration-items')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Temporary-Item-For-Delete',
      type: 'service',
      status: 'draft',
      description: 'Will be deleted',
    });

  const response = await supertest(app)
    .delete(`/api/v1/configuration-items/${created.body.id}`)
    .set('Authorization', `Bearer ${token}`);

  assert.equal(response.status, 204);
});

test('GET /api/v1/configuration-items/:id returns 404 if item is missing', async () => {
  const response = await supertest(app)
    .get('/api/v1/configuration-items/ci-does-not-exist')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(response.status, 404);
  assert.equal(response.body.message, 'Configuration item not found');
});
