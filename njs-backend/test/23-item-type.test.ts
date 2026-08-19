// src/test/23-itemtypes.test.ts
import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';

import { app } from '../src/app';
import {
  nameField,
  colorField,
  attributeGroupsField,
  idField,
  attributeGroupIdField
} from '../src/util/fields.constants';

import {
  getAuthObject,
  validButNotExistingMongoId,
  notAMongoId
} from './functions.test';

import { AttributeGroup } from '../src/models/meta-data/attribute-group.model';
import { AttributeType } from '../src/models/meta-data/attribute-type.model';
import { ItemType } from '../src/models/meta-data/item-type.model';

let adminToken: string;
let editToken: string;
let attributeGroups: AttributeGroup[];
let attributeTypes: AttributeType[];

const rackServerName = 'Rack server hardware';
const rackName = 'Rack';
const bladeEnclosureName = 'Blade enclosure';
const color = '#FFFFFF';

describe('Item types', () => {

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

    // retrieve attribute groups
    const groupsResponse = await request(app)
      .get('/rest/AttributeGroups')
      .set('Authorization', editToken)
      .expect(200)
      .expect('Content-Type', /json/);

    assert.ok(groupsResponse.body.length > 1);
    attributeGroups = groupsResponse.body;
  });

  it('should retrieve attribute types', async () => {
    const response = await request(app)
      .get('/rest/AttributeTypes')
      .set('Authorization', editToken)
      .expect(200);

    assert.ok(response.body.length > 3);
    attributeTypes = response.body;
  });

  it('should not find item types for an attribute type yet', async () => {
    const response = await request(app)
      .get('/rest/itemtypes/byallowedattributetype/' + attributeTypes[0][idField])
      .set('Authorization', editToken)
      .expect(200);

    assert.equal(response.body.length, 0);
  });

  it('should create an item type', async () => {
    const response = await request(app)
      .post('/rest/ItemType')
      .set('Authorization', adminToken)
      .send({
        [nameField]: rackServerName,
        [colorField]: color,
        [attributeGroupsField]: [attributeGroups[0], attributeGroups[1], attributeGroups[3]]
      })
      .expect(201);

    assert.equal(response.body[nameField], rackServerName);
    assert.equal(response.body[colorField], color);
    assert.equal(response.body[attributeGroupsField].length, 3);
  });

  it('should find item types for an attribute type', async () => {
    const targetAttrType = attributeTypes.find(
      at => at[attributeGroupIdField] === attributeGroups[0][idField]
    );

    const response = await request(app)
      .get('/rest/itemtypes/byallowedattributetype/' + targetAttrType![idField])
      .set('Authorization', editToken)
      .expect(200);

    assert.equal(response.body.length, 1);
  });

  it('should not find item types for a not existing attribute type', async () => {
    await request(app)
      .get('/rest/itemtypes/byallowedattributetype/' + validButNotExistingMongoId)
      .set('Authorization', editToken)
      .expect(404);
  });

  it('should get a validation error searching item types for an invalid attribute type id', async () => {
    await request(app)
      .get('/rest/itemtypes/byallowedattributetype/' + notAMongoId)
      .set('Authorization', editToken)
      .expect(400);
  });

  it('should not create an item type of the same name', async () => {
    await request(app)
      .post('/rest/ItemType')
      .set('Authorization', adminToken)
      .send({
        [nameField]: rackServerName,
        [colorField]: color
      })
      .expect(400);
  });

  it('should not create an item type without a color', async () => {
    await request(app)
      .post('/rest/ItemType')
      .set('Authorization', adminToken)
      .send({
        [nameField]: 'Test item type',
      })
      .expect(400);
  });

  it('should not create an item type with a wrong color', async () => {
    await request(app)
      .post('/rest/ItemType')
      .set('Authorization', adminToken)
      .send({
        [nameField]: 'Test item type',
        [colorField]: 'black'
      })
      .expect(400);
  });

  it('should not create an item type with wrong attribute groups', async () => {
    await request(app)
      .post('/rest/ItemType')
      .set('Authorization', adminToken)
      .send({
        [nameField]: 'Test item type',
        [colorField]: color,
        [attributeGroupsField]: ['test']
      })
      .expect(400);
  });

  it('should not create an item type with duplicate attribute groups', async () => {
    await request(app)
      .post('/rest/ItemType')
      .set('Authorization', adminToken)
      .send({
        [nameField]: 'Test item type',
        [colorField]: color,
        [attributeGroupsField]: [attributeGroups[1], attributeGroups[1]]
      })
      .expect(400);
  });

  it('should not be allowed to create an item type as editor', async () => {
    await request(app)
      .post('/rest/ItemType')
      .set('Authorization', editToken)
      .send({
        [nameField]: rackName,
        [colorField]: color
      })
      .expect(403);
  });

  let itemType: ItemType;

  it('should create another item type', async () => {
    const response = await request(app)
      .post('/rest/ItemType')
      .set('Authorization', adminToken)
      .send({
        [nameField]: 'Item Type 2',
        [colorField]: color,
        [attributeGroupsField]: [attributeGroups[1]]
      })
      .expect(201);

    assert.equal(response.body[attributeGroupsField].length, 1);
    itemType = response.body;
  });

  it('should retrieve 1 attribute group in this item type', async () => {
    const response = await request(app)
      .get('/rest/attributegroups/initemtype/' + itemType[idField])
      .set('Authorization', adminToken)
      .expect(200);

    assert.equal(response.body.length, 1);
    assert.equal(response.body[0][idField], attributeGroups[1][idField]);
  });

  it('should retrieve 3 attribute groups not in this item type', async () => {
    const response = await request(app)
      .get('/rest/attributegroups/notinitemtype/' + itemType[idField])
      .set('Authorization', adminToken)
      .expect(200);

    assert.equal(response.body.length, 3);
  });

  it('should detect an update with no changes', async () => {
    await request(app)
      .put('/rest/ItemType/' + itemType.id)
      .set('Authorization', adminToken)
      .send({
        ...itemType,
      })
      .expect(304);
  });

  it('should update an item type', async () => {
    const response = await request(app)
      .put('/rest/ItemType/' + itemType.id)
      .set('Authorization', adminToken)
      .send({
        ...itemType,
        [nameField]: rackName,
        [attributeGroupsField]: [attributeGroups[0]]
      })
      .expect(200);

    assert.equal(response.body[attributeGroupsField].length, 1);
    assert.equal(response.body[attributeGroupsField][0][idField], attributeGroups[0][idField]);
    itemType = response.body;
  });

  it('should not update an item type to a duplicate name', async () => {
    const response = await request(app)
      .put('/rest/ItemType/' + itemType.id)
      .set('Authorization', adminToken)
      .send({
        ...itemType,
        [nameField]: rackServerName
      })
      .expect(400);

    itemType = response.body;
  });

  it('should detect a difference between ids', async () => {
    const response = await request(app)
      .put('/rest/ItemType/' + itemType.id)
      .set('Authorization', adminToken)
      .send({
        ...itemType,
        [idField]: validButNotExistingMongoId,
        [nameField]: rackServerName
      })
      .expect(400);

    itemType = response.body;
  });

  it('should not update an item type as an editor', async () => {
    const response = await request(app)
      .put('/rest/ItemType/' + itemType.id)
      .set('Authorization', editToken)
      .send({
        ...itemType,
        [nameField]: 'Test name'
      })
      .expect(403);

    itemType = response.body;
  });

  it('should create another item type', async () => {
    const response = await request(app)
      .post('/rest/ItemType')
      .set('Authorization', adminToken)
      .send({
        [nameField]: 'Test Item type',
        [colorField]: color,
      })
      .expect(201);

    itemType = response.body;
  });

  it('should read the item type', async () => {
    const response = await request(app)
      .get('/rest/ItemType/' + itemType.id)
      .set('Authorization', adminToken)
      .expect(200);

    assert.equal(response.body.id, itemType.id);
    assert.equal(response.body.name, itemType.name);
  });

  it('should not get a non existing item type', async () => {
    await request(app)
      .get('/rest/ItemType/' + validButNotExistingMongoId)
      .set('Authorization', adminToken)
      .expect(404);
  });

  it('should get a validation error reading an item type with an invalid id', async () => {
    await request(app)
      .get('/rest/ItemType/' + notAMongoId)
      .set('Authorization', adminToken)
      .expect(400);
  });

  it('should not be able to delete the item type as editor', async () => {
    await request(app)
      .delete('/rest/ItemType/' + itemType.id)
      .set('Authorization', editToken)
      .expect(403);
  });

  it('should delete the item type', async () => {
    await request(app)
      .delete('/rest/ItemType/' + itemType.id)
      .set('Authorization', adminToken)
      .expect(200);
  });

  let itemTypes: ItemType[];

  it('should read all item types and retrieve 2', async () => {
    const response = await request(app)
      .get('/rest/ItemTypes')
      .set('Authorization', editToken)
      .expect(200);

    assert.equal(response.body.length, 2);
    itemTypes = response.body;
  });

  it('should retrieve 3 attribute types for the first item type', async () => {
    const response = await request(app)
      .get('/rest/attributetypes/foritemtype/' + itemTypes[0][idField])
      .set('Authorization', editToken)
      .expect(200);

    assert.equal(response.body.length, 3);
  });

  it('should retrieve 5 attribute types for the second item type', async () => {
    const response = await request(app)
      .get('/rest/attributetypes/foritemtype/' + itemTypes[1][idField])
      .set('Authorization', editToken)
      .expect(200);

    assert.equal(response.body.length, 5);
    assert.ok(response.body[0][nameField] < response.body[1][nameField]);
    assert.ok(response.body[1][nameField] < response.body[2][nameField]);
    assert.ok(response.body[2][nameField] < response.body[3][nameField]);
    assert.ok(response.body[3][nameField] < response.body[4][nameField]);
  });

  it('should create another item type', async () => {
    const response = await request(app)
      .post('/rest/ItemType')
      .set('Authorization', adminToken)
      .send({
        [nameField]: bladeEnclosureName,
        [colorField]: color,
      })
      .expect(201);

    itemType = response.body;
  });

  it('should mark an item type without items and rules as deletable', async () => {
    const response = await request(app)
      .get('/rest/itemType/' + itemType[idField] + '/candelete')
      .set('Authorization', editToken)
      .expect(200);

    assert.equal(response.body, true);
  });

  it('should read all item types and retrieve 3 in a sorted order', async () => {
    const response = await request(app)
      .get('/rest/ItemTypes')
      .set('Authorization', editToken)
      .expect(200);

    assert.equal(response.body.length, 3);
    assert.ok(response.body[0][nameField] < response.body[1][nameField]);
    assert.ok(response.body[1][nameField] < response.body[2][nameField]);
  });

  it('should create a singleton item type', async () => {
    await request(app)
      .post('/rest/ItemType')
      .set('Authorization', adminToken)
      .send({
        [nameField]: 'ZZZ-Singleton',
        [colorField]: color,
      })
      .expect(201);
  });

});
