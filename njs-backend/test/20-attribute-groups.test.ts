// src/test/20-attribute-group.test.ts
import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';

import { app } from '../src/app';
import { nameField, idField } from '../src/util/fields.constants';
import { validButNotExistingMongoId, notAMongoId, getAuthObject } from './functions.test';
import { AttributeGroup } from '../src/models/meta-data/attribute-group.model';

let adminToken: string;
const hardwareAttributesName = 'Hardware attributes';
const networkAttributesName = 'Network attributes';

describe('Attribute groups', () => {

  before(async () => {
    const response = await request(app)
      .post('/login')
      .send(getAuthObject(2))
      .expect(200)
      .expect('Content-Type', /json/);

    assert.ok(response.body.token);
    assert.equal(response.body.username, 'testadmin');

    adminToken = 'Bearer ' + response.body.token;
  });

  it('should create an attribute group', async () => {
    const response = await request(app)
      .post('/rest/AttributeGroup')
      .set('Authorization', adminToken)
      .send({
        [nameField]: hardwareAttributesName
      })
      .expect(201)
      .expect('Content-Type', /json/);

    assert.equal(response.body[nameField], hardwareAttributesName);
  });

  it('should not create an attribute group of the same name', async () => {
    await request(app)
      .post('/rest/AttributeGroup')
      .set('Authorization', adminToken)
      .send({
        [nameField]: hardwareAttributesName
      })
      .expect(400);
  });

  let attributeGroup: AttributeGroup;

  it('should create an attribute group', async () => {
    const response = await request(app)
      .post('/rest/AttributeGroup')
      .set('Authorization', adminToken)
      .send({
        [nameField]: 'Attribute Group 2'
      })
      .expect(201)
      .expect('Content-Type', /json/);

    attributeGroup = response.body;
  });

  it('should detect an update with no changes', async () => {
    await request(app)
      .put('/rest/AttributeGroup/' + attributeGroup.id)
      .set('Authorization', adminToken)
      .send({
        ...attributeGroup,
      })
      .expect(304);
  });

  it('should update an attribute group', async () => {
    await request(app)
      .put('/rest/AttributeGroup/' + attributeGroup.id)
      .set('Authorization', adminToken)
      .send({
        ...attributeGroup,
        [nameField]: networkAttributesName
      })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('should not update an attribute group to a duplicate name', async () => {
    await request(app)
      .put('/rest/AttributeGroup/' + attributeGroup.id)
      .set('Authorization', adminToken)
      .send({
        ...attributeGroup,
        [nameField]: hardwareAttributesName
      })
      .expect(400);
  });

  it('should detect a difference between ids', async () => {
    await request(app)
      .put('/rest/AttributeGroup/' + attributeGroup.id)
      .set('Authorization', adminToken)
      .send({
        ...attributeGroup,
        [idField]: validButNotExistingMongoId,
        [nameField]: hardwareAttributesName
      })
      .expect(400);
  });

  it('should create another attribute group', async () => {
    const response = await request(app)
      .post('/rest/AttributeGroup')
      .set('Authorization', adminToken)
      .send({
        [nameField]: 'Test Attribute group'
      })
      .expect(201)
      .expect('Content-Type', /json/);

    attributeGroup = response.body;
  });

  it('should read the attribute group', async () => {
    const response = await request(app)
      .get('/rest/AttributeGroup/' + attributeGroup.id)
      .set('Authorization', adminToken)
      .expect(200)
      .expect('Content-Type', /json/);

    assert.equal(response.body.id, attributeGroup.id);
    assert.equal(response.body.name, attributeGroup.name);
  });

  it('should get an error reading a non existing attribute group', async () => {
    await request(app)
      .get('/rest/AttributeGroup/' + validButNotExistingMongoId)
      .set('Authorization', adminToken)
      .expect(404);
  });

  it('should get a validation error reading an attribute group with an invalid id', async () => {
    await request(app)
      .get('/rest/AttributeGroup/' + notAMongoId)
      .set('Authorization', adminToken)
      .expect(400);
  });

  it('should delete the attribute group', async () => {
    await request(app)
      .delete('/rest/AttributeGroup/' + attributeGroup.id)
      .set('Authorization', adminToken)
      .expect(200);
  });

  it('should create another attribute group', async () => {
    const response = await request(app)
      .post('/rest/AttributeGroup')
      .set('Authorization', adminToken)
      .send({
        [nameField]: 'Status attributes'
      })
      .expect(201)
      .expect('Content-Type', /json/);

    attributeGroup = response.body;
  });

  it('should create another attribute group', async () => {
    const response = await request(app)
      .post('/rest/AttributeGroup')
      .set('Authorization', adminToken)
      .send({
        [nameField]: 'Server attributes'
      })
      .expect(201)
      .expect('Content-Type', /json/);

    attributeGroup = response.body;
  });

  it('should mark attribute group without attribute types as deletable', async () => {
    const response = await request(app)
      .get('/rest/attributegroup/' + attributeGroup[idField] + '/candelete')
      .set('Authorization', adminToken)
      .expect(200)
      .expect('Content-Type', /json/);

    assert.equal(response.body, true);
  });

});
