// src/test/10-user.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';

import { app } from '../src/app';
import { accountNameField, passphraseField, roleField } from '../src/util/fields.constants';
import { getAuthObject } from './functions.test';

let adminToken: string;
let editToken: string;
let delToken: string;

describe('User administration', () => {

  it('should create first user during authentication on empty database', async () => {
    const response = await request(app)
      .post('/login')
      .send(getAuthObject(2))
      .expect(200)
      .expect('Content-Type', /json/);

    assert.ok(response.body.token);
    assert.equal(response.body.username, 'testadmin');

    adminToken = 'Bearer ' + response.body.token;
  });

  it('should have the admin role (2) for this user', async () => {
    const response = await request(app)
      .get('/rest/user/role')
      .set('Authorization', adminToken)
      .expect(200)
      .expect('Content-Type', /json/);

    assert.equal(response.body, 2);
  });

  it('should be able to log in again', async () => {
    const response = await request(app)
      .post('/login')
      .send(getAuthObject(2))
      .expect(200)
      .expect('Content-Type', /json/);

    assert.ok(response.body.token);
    assert.equal(response.body.username, 'testadmin');

    adminToken = 'Bearer ' + response.body.token;
  });

  it('should not create a new user during authentication with already one in the database', async () => {
    await request(app)
      .post('/login')
      .send(getAuthObject(1))
      .expect(401);
  });

  it('should not authenticate existing user with wrong password', async () => {
    await request(app)
      .post('/login')
      .send({
        ...getAuthObject(2),
        [passphraseField]: 'qms8XZYz!'
      })
      .expect(401);
  });

  it('should not create a user with wrong role', async () => {
    await request(app)
      .post('/rest/user')
      .set('Authorization', adminToken)
      .send({
        [accountNameField]: 'TestWrongRole',
        [roleField]: 4,
        [passphraseField]: 'AbCd3FgH!',
      })
      .expect(400);
  });

  it('should not create a user with weak password', async () => {
    await request(app)
      .post('/rest/user')
      .set('Authorization', adminToken)
      .send({
        [accountNameField]: 'TestWeakPassword',
        [roleField]: 0,
        [passphraseField]: 'abc',
      })
      .expect(400);
  });

  it('should create an editor user', async () => {
    const response = await request(app)
      .post('/rest/user')
      .set('Authorization', adminToken)
      .send({
        ...getAuthObject(1),
        [roleField]: 0,
        [passphraseField]: 'vms8XZYz!',
      })
      .expect(201)
      .expect('Content-Type', /json/);

    assert.equal(response.status, 201);
  });

  it('should create a reader user', async () => {
    const response = await request(app)
      .post('/rest/user')
      .set('Authorization', adminToken)
      .send({
        ...getAuthObject(0),
        [roleField]: 0,
      })
      .expect(201)
      .expect('Content-Type', /json/);

    assert.equal(response.status, 201);
  });

  it('should be able to login as reader user', async () => {
    await request(app)
      .post('/login')
      .send(getAuthObject(0))
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('should create a user for deletion', async () => {
    await request(app)
      .post('/rest/user')
      .set('Authorization', adminToken)
      .send({
        [accountNameField]: 'TestDelete',
        [roleField]: 0,
        [passphraseField]: 'abc8XZYz!'
      })
      .expect(201);
  });

  it('should log in as TestDelete', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        [accountNameField]: 'TestDelete',
        [passphraseField]: 'abc8XZYz!'
      })
      .expect(200)
      .expect('Content-Type', /json/);

    delToken = 'Bearer ' + response.body.token;
  });

  it('should not create a duplicate reader user', async () => {
    await request(app)
      .post('/rest/user')
      .set('Authorization', adminToken)
      .send({
        ...getAuthObject(0),
        [roleField]: 0,
      })
      .expect(400);
  });

  it('should detect that no real update is done', async () => {
    await request(app)
      .put('/rest/user')
      .set('Authorization', adminToken)
      .send({
        ...getAuthObject(1),
        [roleField]: 0,
      })
      .expect(304);
  });

  it('should detect that no real update is done with omitted passphrase', async () => {
    await request(app)
      .put('/rest/user')
      .set('Authorization', adminToken)
      .send({
        [accountNameField]: getAuthObject(1)[accountNameField],
        [roleField]: 0,
      })
      .expect(304);
  });

  it('should update user to editor', async () => {
    const response = await request(app)
      .put('/rest/user')
      .set('Authorization', adminToken)
      .send({
        [accountNameField]: getAuthObject(1)[accountNameField],
        [roleField]: 1,
      })
      .expect(200)
      .expect('Content-Type', /json/);

    assert.equal(response.body.role, 1);
  });

  it('should delete a user', async () => {
    await request(app)
      .delete('/rest/user/TestDelete/1')
      .set('Authorization', adminToken)
      .expect(200);
  });

  it('should prevent a deleted user from using his token', async () => {
    await request(app)
      .get('/rest/user/current')
      .set('Authorization', delToken)
      .expect(401);
  });

});

describe('User without admin role', () => {

  it('should get an authorization token', async () => {
    const response = await request(app)
      .post('/login')
      .send(getAuthObject(1))
      .expect(200)
      .expect('Content-Type', /json/);

    assert.equal(response.body.username, 'testeditor');
    editToken = 'Bearer ' + response.body.token;
  });

  it('should not be allowed to create a user', async () => {
    const response = await request(app)
      .post('/rest/user')
      .set('Authorization', editToken)
      .send({
        [accountNameField]: 'TestWithMissingPrivilege',
        [roleField]: 0,
        [passphraseField]: 'abc8XZYz!',
      })
      .expect(403)
      .expect('Content-Type', /json/);

    assert.equal(response.status, 403);
  });

  it('should not be allowed to update an existing user', async () => {
    const response = await request(app)
      .put('/rest/user')
      .set('Authorization', editToken)
      .send({
        [accountNameField]: getAuthObject(0)[accountNameField],
        [roleField]: 1,
      })
      .expect(403)
      .expect('Content-Type', /json/);

    assert.equal(response.status, 403);
  });

  it('should update his passphrase', async () => {
    await request(app)
      .patch('/rest/user/passphrase')
      .set('Authorization', editToken)
      .send({
        [passphraseField]: 'TestEdit1#',
      })
      .expect(200);
  });

  it('should be able to login with the new password', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        [accountNameField]: getAuthObject(1)[accountNameField],
        [passphraseField]: 'TestEdit1#'
      })
      .expect(200)
      .expect('Content-Type', /json/);

    assert.equal(response.body.username, 'testeditor');
    editToken = 'Bearer ' + response.body.token;
  });

  it('should not be allowed to delete a user', async () => {
    const response = await request(app)
      .delete('/rest/user/Testreader/1')
      .set('Authorization', editToken)
      .expect(403)
      .expect('Content-Type', /json/);

    assert.equal(response.status, 403);
  });

  it('should read all users', async () => {
    const response = await request(app)
      .get('/rest/users')
      .set('Authorization', editToken)
      .expect(200)
      .expect('Content-Type', /json/);

    assert.equal(response.body.length, 3);
  });

  it('should search and not find the editor user by a part of his name because of wrong role', async () => {
    const response = await request(app)
      .get('/rest/users/search/TED')
      .set('Authorization', editToken)
      .expect(200)
      .expect('Content-Type', /json/);

    assert.equal(response.body.length, 0);
  });

  it('should search and find the reader user by a part of his name', async () => {
    const response = await request(app)
      .get('/rest/users/search/TrE')
      .set('Authorization', editToken)
      .expect(200)
      .expect('Content-Type', /json/);

    assert.equal(response.body.length, 1);
    assert.equal(
      response.body[0][accountNameField],
      getAuthObject(0)[accountNameField].toLowerCase()
    );
  });

  it('should reset editor users password', async () => {
    await request(app)
      .patch('/rest/user/passphrase')
      .set('Authorization', editToken)
      .send({
        [passphraseField]: getAuthObject(1)[passphraseField],
      })
      .expect(200);
  });

  it('should be able to login editor user after password change', async () => {
    await request(app)
      .post('/login')
      .send(getAuthObject(1))
      .expect(200)
      .expect('Content-Type', /json/);
  });

});
