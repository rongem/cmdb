import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app';
import supertest from 'supertest';

test('GET /health returns ok', async () => {
  const app = createApp();
  const response = await supertest(app).get('/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
});

