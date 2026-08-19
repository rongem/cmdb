import request from 'supertest';
import { app } from '../../app';
import {
    nameField,
    idField,
    typeIdField,
    responsibleUsersField,
    linksField,
    uriField,
    descriptionField,
    accountNameField,
    connectionsToLowerField
} from '../../util/fields.constants';
import { getAuthObject, validButNotExistingMongoId, notAMongoId } from '../../test/functions';
import { ItemType } from '../../models/meta-data/item-type.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';

let editToken: string, readerToken: string;
let itemTypes: ItemType[], item: ConfigurationItem, item2: ConfigurationItem;
const be1 = 'Blade Enclosure 1';
const testItemName = 'Test item';

describe('Configuration items - basic tests', function() {
    beforeAll(async () => {
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
    });
    it('should read existing item types', () => {
        return request(app)
            .get('/rest/itemtypes')
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(1);
                itemTypes = response.body;
            });
    });

    it('should not find any items of a type', () => {
        return request(app)
            .get('/rest/configurationitems/bytypes/' + itemTypes[0][idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(0);
            });
    });

    it('should not find any items of a non existing type', () => {
        return request(app)
            .get('/rest/configurationitems/bytypes/' + validButNotExistingMongoId)
            .set('Authorization', editToken)
            .expect(400);
    });

    it('should get a validation error reading items for an invalid type id', () => {
        return request(app)
            .get('/rest/configurationitems/bytypes/' + notAMongoId)
            .set('Authorization', editToken)
            .expect(400);
    });

    it('should create a configuration item', () => {
        return request(app)
            .post('/rest/configurationItem')
            .set('Authorization', editToken)
            .send({
                [nameField]: testItemName,
                [typeIdField]: itemTypes[0][idField],
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(nameField, testItemName);
                expect(response.body).toHaveProperty(typeIdField, itemTypes[0][idField]);
                expect(response.body[responsibleUsersField]).toHaveLength(1);
                expect(response.body[responsibleUsersField][0]).toBe(getAuthObject(1).accountName.toLocaleLowerCase());
                item = response.body;
            });
    });

    it('should not find 1 item of the type', () => {
        return request(app)
            .get('/rest/configurationitems/bytypes/' + itemTypes[0][idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
            });
    });

    it('should find the item by type and name', () => {
        return request(app)
            .get('/rest/configurationitem/type/' + itemTypes[0][idField] + '/name/' + testItemName)
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body).toHaveProperty('id', item[idField]);
            });
    });

    it('should find the item by type and name in lowercase', () => {
        return request(app)
            .get('/rest/configurationitem/type/' + itemTypes[0][idField] + '/name/' + testItemName.toLocaleLowerCase())
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body).toHaveProperty('id', item[idField]);
            });
    });

    it('should find the item by type and incomplete name', () => {
        return request(app)
            .get('/rest/configurationitem/type/' + itemTypes[0][idField] + '/name/' + testItemName.substr(1))
            .set('Authorization', editToken)
            .expect(404);
    });

    it('should not find any item by wrong type and name', () => {
        return request(app)
            .get('/rest/configurationitem/type/' + itemTypes[1][idField] + '/name/' + testItemName)
            .set('Authorization', editToken)
            .expect(404);
    });

    it('should get an error for a non existing type id', () => {
        return request(app)
            .get('/rest/configurationitem/type/' + validButNotExistingMongoId + '/name/' + testItemName)
            .set('Authorization', editToken)
            .expect(400);
    });

    it('should get a validation error for an invalid type id', () => {
        return request(app)
            .get('/rest/configurationitem/type/' + notAMongoId + '/name/' + testItemName)
            .set('Authorization', editToken)
            .expect(400);
    });

    it('should not find 1 item with connections of the type', () => {
        return request(app)
            .get('/rest/configurationitems/bytypes/' + itemTypes[0][idField] + '/full')
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body).toHaveLength(1);
                expect(response.body[0]).toHaveProperty(connectionsToLowerField);
            });
    });

    it('should not be able to create a configuration item as reader', () => {
        return request(app)
            .post('/rest/configurationItem')
            .set('Authorization', readerToken)
            .send({
                [nameField]: 'Test item 2',
                [typeIdField]: itemTypes[0][idField],
            })
            .expect(403);
    });

    it('should not be able to create a duplicate configuration item', () => {
        return request(app)
            .post('/rest/configurationItem')
            .set('Authorization', editToken)
            .send({
                [nameField]: testItemName,
                [typeIdField]: itemTypes[0][idField],
            })
            .expect(400);
    });

    it('should not be able to update a configuration item as reader', () => {
        return request(app)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', readerToken)
            .send({
                ...item,
                [nameField]: be1,
            })
            .expect(403);
    });

    it('should detect an update without changes', () => {
        return request(app)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
            })
            .expect(304);
    });

    it('should not allow to change the item type in an update', () => {
        return request(app)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [typeIdField]: itemTypes[1][idField],
            })
            .expect(400);
    });

    it('should update a configuration item', () => {
        return request(app)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [nameField]: be1,
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(nameField, be1);
                expect(response.body).toHaveProperty(typeIdField, itemTypes[0][idField]);
                item = response.body;
            });
    });

    it('should not be able to delete a configuration item as reader', () => {
        return request(app)
            .delete('/rest/configurationItem/' + item[idField])
            .set('Authorization', readerToken)
            .expect(403);
    });

    it('should abandon responsibility for the configuration item ', () => {
        return request(app)
            .delete('/rest/configurationItem/' + item[idField] + '/responsibility')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body[responsibleUsersField]).not.toContain(getAuthObject(1).accountName.toLocaleLowerCase());
                item = response.body;
            });
    });

    it('should not be able to delete the configuration item without responsibility', () => {
        return request(app)
            .delete('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .expect(403);
    });

    it('should not be able to update the configuration item without responsibility', () => {
        return request(app)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [nameField]: 'No Update',
            })
            .expect(403);
    });

    it('should take responsibility for the configuration item ', () => {
        return request(app)
            .post('/rest/configurationItem/' + item[idField] + '/responsibility')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body[responsibleUsersField]).toContain(getAuthObject(1).accountName.toLocaleLowerCase());
            });
    });

    it('should delete the configuration item ', () => {
        return request(app)
            .delete('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .expect(200);
    });

    it('should create a configuration item with a link and two additional users', () => {
        return request(app)
            .post('/rest/configurationItem')
            .set('Authorization', editToken)
            .send({
                [nameField]: be1,
                [typeIdField]: itemTypes[0][idField],
                [linksField]: [
                    {
                        [uriField]: 'https://nodejs.org/en/',
                        [descriptionField]: 'NodeJS Website'
                    }
                ],
                [responsibleUsersField]: [
                    getAuthObject(2)[accountNameField],
                    getAuthObject(0)[accountNameField],
                ]
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(nameField, be1);
                expect(response.body).toHaveProperty(typeIdField, itemTypes[0][idField]);
                expect(response.body[responsibleUsersField]).toHaveLength(3);
                expect(response.body[responsibleUsersField]).toContain(getAuthObject(1).accountName.toLocaleLowerCase());
                expect(response.body[linksField]).toHaveLength(1);
                expect(response.body[linksField][0]).toHaveProperty(uriField, 'https://nodejs.org/en/')
                expect(response.body[linksField][0]).toHaveProperty(descriptionField, 'NodeJS Website')
                item = response.body;
            });
    });

    it('should create another configuration item', () => {
        return request(app)
            .post('/rest/configurationItem')
            .set('Authorization', editToken)
            .send({
                [nameField]: 'Blade Enclosure 2',
                [typeIdField]: itemTypes[0][idField],
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                item2 = response.body;
            });
    });

    it('should not update a configuration item to a duplicate name (case insensitive)', () => {
        return request(app)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item2,
                [nameField]: be1.toLocaleLowerCase(),
            })
            .expect(400);
    });

    it('should find recently modified items', () => {
        return request(app)
            .get('/rest/configurationItems/recent/10')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(2);
            });
    });

    it('should not find recently modified items smaller than 1', () => {
        return request(app)
            .get('/rest/configurationItems/recent/0')
            .set('Authorization', editToken)
            .expect(400);
    });

    it('should not find recently modified items greater than 1000', () => {
        return request(app)
            .get('/rest/configurationItems/recent/1001')
            .set('Authorization', editToken)
            .expect(400);
    });

});