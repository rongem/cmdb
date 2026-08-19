// src/test/21-attribute-types.test.ts
import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';

import { app } from '../src/app';
import {
  nameField,
  attributeGroupIdField,
  idField,
  validationExpressionField
} from '../src/util/fields.constants';

import {
  getAuthObject,
  validButNotExistingMongoId,
  notAMongoId
} from './functions.test';

import { AttributeType } from '../src/models/meta-data/attribute-type.model';
import { AttributeGroup } from '../src/models/meta-data/attribute-group.model';

let adminToken: string;
let editToken: string;
let attributeGroups: AttributeGroup[];
let attributeType: AttributeType;

const ipAddressName = 'IP address';

// Helper rewritten for Node Test Runner
async function testSuccessfulCreatingAttribute(
  name: string,
  group: string,
  validationExpression: string = '^.*$'
) {
  const response = await request(app)
    .post('/rest/attributetype')
    .set('Authorization', adminToken)
    .send({
      [nameField]: name,
      [attributeGroupIdField]: group,
      [validationExpressionField]: validationExpression,
    })
    .expect(201)
    .expect('Content-Type', /json/);

  assert.equal(response.body[nameField], name);
  assert.equal(response.body[attributeGroupIdField], group);
  assert.equal(response.body[validationExpressionField], validationExpression);

  attributeType = response.body;
}

describe('Attribute types', () => {

  before(async () => {
    // login as admin
    const adminResponse = await request(app)
      .post('/login')
      .send(getAuthObject(2))
      .expect(200)
      .expect('Content-Type', /json/);

    assert.ok(adminResponse.body.token);
    assert.equal(adminResponse.body.username, 'testadmin');
    adminToken = 'Bearer ' + adminResponse.body.token;

    // login as editor
    const editorResponse = await request(app)
      .post('/login')
      .send(getAuthObject(1))
      .expect(200)
      .expect('Content-Type', /json/);

    assert.ok(editorResponse.body.token);
    assert.equal(editorResponse.body.username, 'testeditor');
    editToken = 'Bearer ' + editorResponse.body.token;
  });

  it('should retrieve attribute groups', async () => {
    const response = await request(app)
      .get('/rest/AttributeGroups')
      .set('Authorization', editToken)
      .expect(200)
      .expect('Content-Type', /json/);

    assert.ok(response.body.length > 1);
    attributeGroups = response.body;
  });

  it('should create an ip address attribute type', async () => {
    await testSuccessfulCreatingAttribute(ipAddressName, attributeGroups[1][idField]);
  });

  it('should get the created attribute type', async () => {
    const response = await request(app)
      .get('/rest/attributetype/' + attributeType[idField])
      .set('Authorization', adminToken)
      .expect(200)
      .expect('Content-Type', /json/);

    assert.equal(response.body[nameField], ipAddressName);
  });

  it('should get an error reading a non existing attribute type', async () => {
    await request(app)
      .get('/rest/attributetype/' + validButNotExistingMongoId)
      .set('Authorization', adminToken)
      .expect(404);
  });

  it('should get a validation error reading an attribute type with an invalid id', async () => {
    await request(app)
      .get('/rest/attributetype/' + notAMongoId)
      .set('Authorization', adminToken)
      .expect(400);
  });

  it('should not create a second ip address attribute type', async () => {
    await request(app)
      .post('/rest/attributetype')
      .set('Authorization', adminToken)
      .send({
        [nameField]: ipAddressName,
        [attributeGroupIdField]: attributeGroups[1][idField],
        [validationExpressionField]: '^.*$',
      })
      .expect(400);
  });

  it('should not create an attribute type with an invalid attribute group', async () => {
    await request(app)
      .post('/rest/attributetype')
      .set('Authorization', adminToken)
      .send({
        [nameField]: 'test',
        [attributeGroupIdField]: validButNotExistingMongoId,
        [validationExpressionField]: '^.*$',
      })
      .expect(400);
  });

  it('should not create an attribute type with an invalid regex', async () => {
    await request(app)
      .post('/rest/attributetype')
      .set('Authorization', adminToken)
      .send({
        [nameField]: 'test',
        [attributeGroupIdField]: attributeGroups[1][idField],
        [validationExpressionField]: 'xx',
      })
      .expect(400);
  });

  it('should not create an attribute type as editor', async () => {
    await request(app)
      .post('/rest/attributetype')
      .set('Authorization', editToken)
      .send({
        [nameField]: 'test',
        [attributeGroupIdField]: attributeGroups[1][idField],
        [validationExpressionField]: '^.*$',
      })
      .expect(403);
  });

  it('should create a serial attribute', async () => {
    await testSuccessfulCreatingAttribute('Serial', attributeGroups[1][idField]);
  });

  it('should not update an attribute type as editor', async () => {
    await request(app)
      .put('/rest/attributetype/' + attributeType[idField])
      .set('Authorization', editToken)
      .send({
        ...attributeType,
        [nameField]: 'Serial number',
      })
      .expect(403);
  });

  it('should not update an attribute type to a duplicate name', async () => {
    await request(app)
      .put('/rest/attributetype/' + attributeType[idField])
      .set('Authorization', adminToken)
      .send({
        ...attributeType,
        [nameField]: ipAddressName,
      })
      .expect(400);
  });

  it('should detect an update with no changes', async () => {
    await request(app)
      .put('/rest/attributetype/' + attributeType[idField])
      .set('Authorization', adminToken)
      .send({
        ...attributeType,
      })
      .expect(304);
  });

  it('should update an attribute type', async () => {
    const response = await request(app)
      .put('/rest/attributetype/' + attributeType[idField])
      .set('Authorization', adminToken)
      .send({
        ...attributeType,
        [nameField]: 'Serial number',
        [attributeGroupIdField]: attributeGroups[0][idField],
      })
      .expect(200)
      .expect('Content-Type', /json/);

    assert.equal(response.body[nameField], 'Serial number');
    assert.equal(response.body[attributeGroupIdField], attributeGroups[0][idField]);
  });

  it('should create a manufacturer attribute', async () => {
    await testSuccessfulCreatingAttribute('Manufacturer', attributeGroups[0][idField]);
  });

  it('should create a model attribute', async () => {
    await testSuccessfulCreatingAttribute('Model', attributeGroups[0][idField]);
  });

  it('should create a waste attribute', async () => {
    await testSuccessfulCreatingAttribute('Waste', attributeGroups[0][idField]);
  });

  it('should not be allowed to delete an attribute type as editor', async () => {
    await request(app)
      .delete('/rest/attributetype/' + attributeType[idField])
      .set('Authorization', editToken)
      .expect(403);
  });

  it('should delete an attribute type', async () => {
    await request(app)
      .delete('/rest/attributetype/' + attributeType[idField])
      .set('Authorization', adminToken)
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('should retrieve 3 attribute types for the first group in a sorted order', async () => {
    const response = await request(app)
      .get('/rest/attributetypes/forgroup/' + attributeGroups[0][idField])
      .set('Authorization', editToken)
      .expect(200)
      .expect('Content-Type', /json/);

    assert.equal(response.body.length, 3);
    assert.ok(response.body[0][nameField] < response.body[1][nameField]);
    assert.ok(response.body[1][nameField] < response.body[2][nameField]);
  });

  it('should create a status attribute', async () => {
    await testSuccessfulCreatingAttribute('Status', attributeGroups[3][idField]);
  });

  it('should create a CPU count attribute', async () => {
    await testSuccessfulCreatingAttribute('CPU Count', attributeGroups[2][idField]);
  });

  it('should mark an attribute group with attribute types as not deletable', async () => {
    const response = await request(app)
      .get('/rest/attributegroup/' + attributeGroups[0][idField] + '/candelete')
      .set('Authorization', editToken)
      .expect(200)
      .expect('Content-Type', /json/);

    assert.equal(response.body, false);
  });

  it('should not delete an attribute group with attribute types', async () => {
    await request(app)
      .delete('/rest/attributegroup/' + attributeGroups[0][idField])
      .set('Authorization', adminToken)
      .expect(400);
  });

});
