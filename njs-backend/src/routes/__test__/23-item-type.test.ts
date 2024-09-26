import request from 'supertest';
import { app } from '../../app';
import { nameField, colorField, attributeGroupsField, idField, attributeGroupIdField } from '../../util/fields.constants';
import { getAuthObject, validButNotExistingMongoId, notAMongoId } from '../../test/functions';
import { AttributeGroup } from '../../models/meta-data/attribute-group.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { ItemType } from '../../models/meta-data/item-type.model';

let adminToken: string, editToken: string;
let attributeGroups: AttributeGroup[];
let attributeTypes: AttributeType[];
const rackServerName = 'Rack server hardware';
const rackName = 'Rack';
const bladeEnclosureName = 'Blade enclosure';
const color = '#FFFFFF';

describe('Item types', function() {
    beforeAll(async () => {
        // login as admin and store token
        await request(app)
            .post('/login')
            .send(getAuthObject(2))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.token).toBeDefined();
                adminToken = 'Bearer ' + response.body.token;
                expect(response.body.username).toBe('testadmin');
            });
        await request(app)
            .post('/login')
            .send(getAuthObject(1))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                editToken = 'Bearer ' + response.body.token;
                expect(response.body.username).toBe('testeditor');
            });
        await request(app)
            .get('/rest/AttributeGroups')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(1);
                attributeGroups = response.body;
            });
    });

    it('should retrieve attribute types', () => {
        return request(app)
            .get('/rest/AttributeTypes')
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(3);
                attributeTypes = response.body;
            });
    });

    it('should not find item types for an attribute type yet', () => {
        return request(app)
            .get('/rest/itemtypes/byallowedattributetype/' + attributeTypes[0][idField])
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body).toHaveLength(0);
            });
    });

    it('should create an item type', () => {
        return request(app)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: rackServerName,
                [colorField]: color,
                [attributeGroupsField]: [attributeGroups[0], attributeGroups[1], attributeGroups[3]]
            })
            .expect(201)
            .then(response => {
                expect(response.body).toHaveProperty(nameField, rackServerName);
                expect(response.body).toHaveProperty(colorField, color);
                expect(response.body[attributeGroupsField]).toHaveLength(3);
            });
    });

    it('should find item types for an attribute type', () => {
        return request(app)
            .get('/rest/itemtypes/byallowedattributetype/' + attributeTypes.filter(at => at[attributeGroupIdField] === attributeGroups[0][idField])[0][idField])
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body).toHaveLength(1);
            });
    });

    it('should not find item types for a not existing attribute type', () => {
        return request(app)
            .get('/rest/itemtypes/byallowedattributetype/' + validButNotExistingMongoId)
            .set('Authorization', editToken)
            .expect(404);
    });

    it('should get a validation error searching item types for an invalid attribute type id', () => {
        return request(app)
            .get('/rest/itemtypes/byallowedattributetype/' + notAMongoId)
            .set('Authorization', editToken)
            .expect(400);
    });

    it('should not create an item type of the same name', () => {
        return request(app)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: rackServerName,
                [colorField]: color
            })
            .expect(400);
    });

    it('should not create an item type without a color', () => {
        return request(app)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Test item type',
            })
            .expect(400);
    });

    it('should not create an item type without a wrong color', () => {
        return request(app)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Test item type',
                [colorField]:'black'
            })
            .expect(400);
    });

    it('should not create an item type with wrong attribute groups', () => {
        return request(app)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Test item type',
                [colorField]: color,
                [attributeGroupsField]: ['test']
            })
            .expect(400);
    });

    it('should not create an item type with duplicate attribute groups', () => {
        return request(app)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Test item type',
                [colorField]: color,
                [attributeGroupsField]: [attributeGroups[1], attributeGroups[1]]
            })
            .expect(400);
    });

    it('should not be allowed to create an item type as editor', () => {
        return request(app)
            .post('/rest/ItemType')
            .set('Authorization', editToken)
            .send({
                [nameField]: rackName,
                [colorField]: color
            })
            .expect(403);
    });

    let itemType: ItemType;

    it('should create another item type', () => {
        return request(app)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Item Type 2',
                [colorField]: color,
                [attributeGroupsField]: [attributeGroups[1]]
            })
            .expect(201)
            .then(response => {
                expect(response.body[attributeGroupsField].length).toBe(1);
                itemType = response.body;
            });
    });

    it('should retrieve 1 attribute group in this item type', () => {
        return request(app)
            .get('/rest/attributegroups/initemtype/' + itemType[idField])
            .set('Authorization', adminToken)
            .expect(200)
            .then(response => {
                expect(response.body).toHaveLength(1);
                expect(response.body[0][idField]).toBe(attributeGroups[1][idField])
            });
    });

    it('should retrieve 3 attribute groups not in this item type', () => {
        return request(app)
            .get('/rest/attributegroups/notinitemtype/' + itemType[idField])
            .set('Authorization', adminToken)
            .expect(200)
            .then(response => {
                expect(response.body).toHaveLength(3);
            });
    });

    it('should detect an update with no changes', () => {
        return request(app)
            .put('/rest/ItemType/' + itemType.id)
            .set('Authorization', adminToken)
            .send({
                ...itemType,
            })
            .expect(304);
    });

    it('should update an item type', () => {
        return request(app)
            .put('/rest/ItemType/' + itemType.id)
            .set('Authorization', adminToken)
            .send({
                ...itemType,
                [nameField]: rackName,
                [attributeGroupsField]: [attributeGroups[0]]
            })
            .expect(200)
            .then(response => {
                expect(response.body[attributeGroupsField].length).toBe(1);
                expect(response.body[attributeGroupsField][0][idField]).toBe(attributeGroups[0][idField]);
                itemType = response.body;
            });
    });

    it('should not update an item type to a duplicate name', () => {
        return request(app)
            .put('/rest/ItemType/' + itemType.id)
            .set('Authorization', adminToken)
            .send({
                ...itemType,
                [nameField]: rackServerName
            })
            .expect(400)
            .then(response => {
                itemType = response.body;
            });
    });

    it('should detect a difference between ids', () => {
        return request(app)
            .put('/rest/ItemType/' + itemType.id)
            .set('Authorization', adminToken)
            .send({
                ...itemType,
                [idField]: validButNotExistingMongoId,
                [nameField]: rackServerName
            })
            .expect(400)
            .then(response => {
                itemType = response.body;
            });
    });

    it('should not update an item type as an editor', () => {
        return request(app)
            .put('/rest/ItemType/' + itemType.id)
            .set('Authorization', editToken)
            .send({
                ...itemType,
                [nameField]: 'Test name'
            })
            .expect(403)
            .then(response => {
                itemType = response.body;
            });
    });

    it('should create another item type', () => {
        return request(app)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Test Item type',
                [colorField]: color,
            })
            .expect(201)
            .then(response => {
                itemType = response.body;
            });
    });

    it('should read the item type', () => {
        return request(app)
            .get('/rest/ItemType/' + itemType.id)
            .set('Authorization', adminToken)
            .expect(200)
            .then(response => {
                expect(response.body.id).toBe(itemType.id);
                expect(response.body.name).toBe(itemType.name);
            });
    });

    it('should not get a non existing item type', () => {
        return request(app)
            .get('/rest/ItemType/' + validButNotExistingMongoId)
            .set('Authorization', adminToken)
            .expect(404);
    });

    it('should get a validation error reading an item type with an invalid id', () => {
        return request(app)
            .get('/rest/ItemType/' + notAMongoId)
            .set('Authorization', adminToken)
            .expect(400);
    });

    it('should not be able to delete the item type as editor', () => {
        return request(app)
            .delete('/rest/ItemType/' + itemType.id)
            .set('Authorization', editToken)
            .expect(403);
    });

    it('should delete the item type', () => {
        return request(app)
            .delete('/rest/ItemType/' + itemType.id)
            .set('Authorization', adminToken)
            .expect(200);
    });

    let itemTypes: ItemType[];

    it('should read all item types and retrieve 2', () => {
        return request(app)
            .get('/rest/ItemTypes')
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body.length).toBe(2);
                itemTypes = response.body;
            });
    });

    it('should retrieve 3 attribute types for the first item type', () => {
        return request(app)
            .get('/rest/attributetypes/foritemtype/' + itemTypes[0][idField])
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body.length).toBe(3);
            });
    });

    it('should retrieve 5 attribute types for the second item type', () => {
        return request(app)
            .get('/rest/attributetypes/foritemtype/' + itemTypes[1][idField])
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body.length).toBe(5);
                expect(response.body[0][nameField] < response.body[1][nameField]).toBe(true);
                expect(response.body[1][nameField] < response.body[2][nameField]).toBe(true);
                expect(response.body[2][nameField] < response.body[3][nameField]).toBe(true);
                expect(response.body[3][nameField] < response.body[4][nameField]).toBe(true);
            });
    });

    it('should create another item type', () => {
        return request(app)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: bladeEnclosureName,
                [colorField]: color,
            })
            .expect(201)
            .then(response => {
                itemType = response.body;
            });
    });

    it('should mark an item type without items and rules as deletable', () => {
        return request(app)
            .get('/rest/itemType/' + itemType[idField] + '/candelete')
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body).toBe(true);
            });
    });

    it('should read all item types and retrieve 3 in a sorted order', () => {
        return request(app)
            .get('/rest/ItemTypes')
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body.length).toBe(3);
                expect(response.body[0][nameField] < response.body[1][nameField]).toBe(true);
                expect(response.body[1][nameField] < response.body[2][nameField]).toBe(true);
            });
    });

    it('should create a singleton item type', () => {
        return request(app)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'ZZZ-Singleton',
                [colorField]: color,
            })
            .expect(201);
    });

});
