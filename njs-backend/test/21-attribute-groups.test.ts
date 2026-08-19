import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';

import { app } from '../src/app';
import { getAuthObject } from './functions.test';
import { AttributeGroup } from '../src/models/meta-data/attribute-group.model';
import { nameField } from '../src/util/fields.constants';

let editToken: string;
let attributeGroup: AttributeGroup;
const networkAttributesName = 'Network attributes';

describe('Attribute groups', () => {

  before(async () => {
    const response = await request(app)
      .post('/login')
      .send(getAuthObject(1))
      .expect(200)
      .expect('Content-Type', /json/);

    assert.equal(response.body.username, 'testeditor');
    editToken = 'Bearer ' + response.body.token;
  });

  it('should retrieve all attribute groups', async () => {
    const response = await request(app)
      .get('/rest/AttributeGroups')
      .set('Authorization', editToken)
      .expect(200)
      .expect('Content-Type', /json/);

    attributeGroup = response.body;
  });

  it('should not be allowed to create an attribute group as editor', async () => {
    await request(app)
      .post('/rest/AttributeGroup')
      .set('Authorization', editToken)
      .send({
        [nameField]: networkAttributesName
      })
      .expect(403);
  });

  it('should not update an attribute group as an editor', async () => {
    await request(app)
      .put('/rest/AttributeGroup/' + attributeGroup.id)
      .set('Authorization', editToken)
      .send({
        ...attributeGroup,
        [nameField]: 'Test name'
      })
      .expect(403);
  });

  it('should not be able to delete the attribute group as editor', async () => {
    await request(app)
      .delete('/rest/AttributeGroup/' + attributeGroup.id)
      .set('Authorization', editToken)
      .expect(403);
  });

  it('should read all attribute groups and retrieve 4 in a sorted order', async () => {
    const response = await request(app)
      .get('/rest/AttributeGroups')
      .set('Authorization', editToken)
      .expect(200)
      .expect('Content-Type', /json/);

    assert.equal(response.body.length, 4);

    assert.ok(response.body[0][nameField] < response.body[1][nameField]);
    assert.ok(response.body[1][nameField] < response.body[2][nameField]);
    assert.ok(response.body[2][nameField] < response.body[3][nameField]);
  });

});
