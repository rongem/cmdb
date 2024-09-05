import request from 'supertest';
import { app } from '../../app';
import {
    nameField,
    idField,
    typeIdField,
    linksField,
    uriField,
    descriptionField,
    attributesField,
    valueField,
    attributeGroupsField,
    attributeGroupIdField
} from '../../util/fields.constants';
import {
    getAuthObject,
    getAllowedAttributeTypes,
    getDisallowedAttributeTypes,
    notAMongoId, validButNotExistingMongoId
} from '../../test/functions';
import { ItemType } from '../../models/meta-data/item-type.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { AttributeGroup } from '../../models/meta-data/attribute-group.model';

let adminToken: string, editToken: string, readerToken: string;
let itemTypes: ItemType[], attributeTypes: AttributeType[];
let item: ConfigurationItem, attributeGroups: AttributeGroup[];
let allowedAttributes: AttributeType[], disallowedAttributes: AttributeType[];
const array = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

describe('Configuration items - attributes', function() {
    beforeAll(async () => {
        // login as admin and store token
        await request(app)
            .post('/login')
            .send(getAuthObject(2))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.token).toBeDefined();
                expect(response.body.username).toBe('testadmin');
                adminToken = 'Bearer ' + response.body.token;
            });
        await request(app)
            .post('/login')
            .send(getAuthObject(1))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.username).toBe('testeditor');
                editToken = 'Bearer ' + response.body.token;
            });
        await request(app)
            .post('/login')
            .send(getAuthObject(0))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.username).toBe('testreader');
                readerToken = 'Bearer ' + response.body.token;
            });
        await request(app)
            .get('/rest/metadata')
            .set('Authorization', readerToken)
            .expect(200)            
            .expect('Content-Type', /json/)
            .then(response => {
                attributeGroups = response.body[attributeGroupsField];
                attributeTypes = response.body.attributeTypes;
                itemTypes = response.body.itemTypes;
                allowedAttributes = getAllowedAttributeTypes(itemTypes[2], attributeTypes);
                disallowedAttributes = getDisallowedAttributeTypes(itemTypes[2], attributeTypes);
            });
    });

    it('should create a configuration item with all allowed attributes', () => {
        return request(app)
            .post('/rest/configurationItem')
            .set('Authorization', editToken)
            .send({
                [nameField]: 'Rack server 1',
                [typeIdField]: itemTypes[2][idField],
                [attributesField]: allowedAttributes.map(a => ({
                    [typeIdField]: a[idField],
                    [valueField]: 'my value',
                })),
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body[attributesField]).toHaveLength(allowedAttributes.length);
                item = response.body;
            });
    });

    it('should count 1 attribute for the allowed attribute type', () => {
        return request(app)
            .get('/rest/attributetype/' + allowedAttributes[0][idField] + '/attributes/count')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toBe(1);
            });
    });

    it('should count 0 attributes for the non allowed attribute type', () => {
        return request(app)
            .get('/rest/attributetype/' + disallowedAttributes[0][idField] + '/attributes/count')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toBe(0);
            });
    });

    it('should get an error for a non existing attribute type id', () => {
        return request(app)
            .get('/rest/attributetype/' + validButNotExistingMongoId + '/attributes/count')
            .set('Authorization', editToken)
            .expect(404);
    });

    it('should get a validation error for an invalid attribute type id', () => {
        return request(app)
            .get('/rest/attributetype/' + notAMongoId + '/attributes/count')
            .set('Authorization', editToken)
            .expect(400);
    });

    it('should not create a configuration item with any disallowed attributes', () => {
        return request(app)
            .post('/rest/configurationItem')
            .set('Authorization', editToken)
            .send({
                [nameField]: 'Rack server 2',
                [typeIdField]: itemTypes[2][idField],
                [attributesField]: disallowedAttributes.map(a => ({
                    [typeIdField]: a[idField],
                    [valueField]: 'my value',
                })),
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.data.errors).toHaveLength(disallowedAttributes.length);
            });
    });

    it('should not create a configuration item with duplicate attribute types', () => {
        return request(app)
            .post('/rest/configurationItem')
            .set('Authorization', editToken)
            .send({
                [nameField]: 'Rack server 2',
                [typeIdField]: itemTypes[2][idField],
                [attributesField]: [{
                        [typeIdField]: allowedAttributes[0][idField],
                        [valueField]: 'my value',
                    }, {
                        [typeIdField]: allowedAttributes[0][idField],
                        [valueField]: 'my value 2',
                }]
            })
            .expect(400);
    });

    it('should not update a configuration item with a disallowed attribute', () => {
        return request(app)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [attributesField]: [...item[attributesField], {
                    [typeIdField]: disallowedAttributes[0][idField],
                    [valueField]: 'my value'
                }]
            })
            .expect(400);
    });

    it('should not update a configuration item with a duplicate attribute', () => {
        return request(app)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [attributesField]: [...item[attributesField], {
                    ...item[attributesField][0],
                    [idField]: undefined,
                    [valueField]: 'my value 2'
                }]
            })
            .expect(400);
    });

    it('should update a configuration item with a removed attribute', () => {
        return request(app)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [attributesField]: item[attributesField].filter((a, i) => i !== 0)
            })
            .expect(200)
            .then(response => {
                expect(response.body[attributesField]).toHaveLength(allowedAttributes.length - 1);
                item = response.body;
            });
    });

    it('should update a configuration item with another removed attribute and added an allowed one', () => {
        return request(app)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [attributesField]: [...item[attributesField].filter((a, i) => i !== 0), {
                    [typeIdField]: allowedAttributes[0][idField],
                    [valueField]: 'ip value'
                }]
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body[attributesField]).toHaveLength(allowedAttributes.length - 1);
                item = response.body;
            });
    });

    it('should remove an attribute group from the item type', () => {
        attributeGroups = itemTypes[2][attributeGroupsField]!;
        return request(app)
            .put('/rest/itemtype/' + itemTypes[2][idField])
            .set('Authorization', adminToken)
            .send({
                ...itemTypes[2],
                [attributeGroupsField]: itemTypes[2][attributeGroupsField]!.filter(ag => ag[idField] !== allowedAttributes[0][attributeGroupIdField]),
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                itemTypes[2] = response.body;
            });
    });

    it('should read an item where the attribute from before is removed', () => {
        return request(app)
            .get('/rest/configurationitem/' + item[idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body[attributesField]).toHaveLength(allowedAttributes.length - 2);
                item = response.body;
            });
    });

    it('should change item type with more attribute groups', () => {
        return request(app)
            .put('/rest/itemtype/' + itemTypes[2][idField])
            .set('Authorization', adminToken)
            .send({
                ...itemTypes[2],
                [attributeGroupsField]: attributeGroups,
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                itemTypes[2] = response.body;
            });
    });

    it('should set ip value for item', () => {
        return request(app)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [attributesField]: [...item[attributesField], {
                    [typeIdField]: allowedAttributes[0][idField],
                    [valueField]: 'ip value'
                }]
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body[attributesField]).toHaveLength(allowedAttributes.length - 1);
                item = response.body;
            });
    });
});

describe('Configuration items - links', function() {
    it('should update the item with two links to external sites', () => {
        return request(app)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [linksField]: [
                    { [uriField]: 'https://nodejs.org', [descriptionField]: 'Node JS' },
                    { [uriField]: 'https://angular.io', [descriptionField]: 'Angular' },
                ]
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body[linksField]).toHaveLength(2);
                item = response.body;
            });
    });

    it('should not update the item with illegal links', () => {
        return request(app)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [linksField]: [
                    ...item[linksField],
                    { [uriField]: 'file://myserver/test', [descriptionField]: 'File server' },
                    { [uriField]: 'https://angular.io' },
                    { [descriptionField]: 'File server' },
                ]
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.data.errors).toHaveLength(4);
            });
    });

    it('should update the item while removing a link', () => {
        return request(app)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [linksField]: [item[linksField][1]]
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body[linksField][0]).toHaveProperty(uriField, item[linksField][1][uriField]);
                item = response.body;
            });
    });

    it('should read the item', () => {
        return request(app)
            .get('/rest/configurationItem/' + item[idField])
            .set('Authorization', readerToken)
            .expect(200);
    });

    it('should read the full item (i.e. with connections)', () => {
        return request(app)
            .get('/rest/configurationItem/' + item[idField] + '/full')
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/);
    });

    it('should mark an attribute type with active attributes as not deletable', () => {
        return request(app)
            .get('/rest/attributetype/' + item[attributesField][0][typeIdField] + '/candelete')
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toBe(false);
            });
    });

    it('should not delete an attriubute type with active attributes', () => {
        return request(app)
            .delete('/rest/attributetype/' + item[attributesField][0][typeIdField])
            .set('Authorization', adminToken)
            .expect(400);
    })

});

describe('Item types and configuration items', function() {

    it('should mark an item type without items and rules as deletable', () => {
        return request(app)
            .get('/rest/itemType/' + itemTypes[itemTypes.length - 1][idField] + '/candelete')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toBe(true);
            });
    });

    it('should create an item for the singleton type', () => {
        return request(app)
            .post('/rest/configurationItem')
            .set('Authorization', editToken)
            .send({
                [nameField]: 'Singleton 1',
                [typeIdField]: itemTypes[itemTypes.length - 1][idField],
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                item = response.body;
            });
    });

    it('should mark an item type with items as not deletable', () => {
        return request(app)
            .get('/rest/itemType/' + itemTypes[itemTypes.length - 1][idField] + '/candelete')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toBe(false);
            });
    });

    it('should not be able to delete an item type with active items', () => {
        return request(app)
            .delete('/rest/itemtype/' + item[typeIdField])
            .set('Authorization', adminToken)
            .expect(400);
    });

    it('should get a proposal for an attribute value', () => {
        return request(app)
            .get('/rest/proposals/my v')
            .set('Authorization', adminToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(0);
                expect(response.body).toContain('my value');
            });
    });

    it('should create various items for later tests', async () => {
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            for (let j = 0; j < 3; j++) {
                await createItem(element, j);
            }
        }
    });
});

function createItem(i: string, itemType: number) {
    return request(app)
        .post('/rest/configurationItem')
        .set('Authorization', editToken)
        .send({
            [nameField]: itemTypes[itemType][nameField] + ' ' + i.toString(),
            [typeIdField]: itemTypes[itemType][idField],
        })
        .expect(201)
        .expect('Content-Type', /json/);
};
