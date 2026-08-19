import request from 'supertest';
import { app } from '../../app';
import {
    idField,
    typeIdField,
    nameField,
    descriptionField,
    ruleIdField,
    responsibleUsersField,
    connectionsToUpperField,
    connectionsToLowerField,
    targetIdField,
    maxConnectionsToUpperField,
    colorField } from '../../util/fields.constants';
import { getAuthObject, validButNotExistingMongoId, notAMongoId } from '../../test/functions';
import { ItemType } from '../../models/meta-data/item-type.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';

let editToken: string, readerToken: string;
let itemTypes: ItemType[]
let items0: ConfigurationItem[], items1: ConfigurationItem[], items2: ConfigurationItem[]
let rule: ConnectionRule;

describe('Configuration items and connections', function() {
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
        await request(app)
            .get('/rest/itemtypes')
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(2);
                itemTypes = response.body;
            });
        await request(app)
            .get('/rest/configurationitems/bytypes/' + itemTypes[0][idField])
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                items0 = response.body;
            });
        await request(app)
            .get('/rest/configurationitems/bytypes/' + itemTypes[1][idField])
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                items1 = response.body;
            });
        await request(app)
            .get('/rest/configurationitems/bytypes/' + itemTypes[2][idField])
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                items2 = response.body;
            });
        await request(app)
            .get('/rest/configurationitems/bytypes/' + itemTypes[2][idField])
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                items2 = response.body;
            });
        await request(app)
            .get('/rest/connectionrules/forupperitemtype/' + itemTypes[0][idField])
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body).toHaveLength(1);
            });
        await request(app)
            .get('/rest/connectionrules/forupperitemtype/' + itemTypes[2][idField])
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body).toHaveLength(1);
                rule = response.body[0];
            });
    });

    it('should read all configuration items', async () => {
        return request(app)
            .get('/rest/configurationitems/')
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.items).toHaveLength(response.body.totalItems);
            });
    });

    it('should read a full configuration item', async () => {
        return request(app)
            .get('/rest/configurationitem/' + items1[0][idField] + '/full')
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body[colorField]).toBe(items1[0][colorField]);
                expect(response.body[connectionsToUpperField]).toHaveLength(4);
                expect(response.body[connectionsToLowerField]).toHaveLength(0);
            });
    });

    it('should create a full configuration item with connections', async () => {
        return request(app)
            .post('/rest/configurationItem/full')
            .set('Authorization', editToken)
            .send({
                [nameField]: 'Full server 1',
                [typeIdField]: itemTypes[2][idField],
                [connectionsToLowerField]: [{
                    [targetIdField]: items1[0][idField],
                    [ruleIdField]: rule[idField],
                    [descriptionField]: 'xTest',
                }]
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(nameField, 'Full server 1');
                expect(response.body).toHaveProperty(typeIdField, itemTypes[2][idField]);
                expect(response.body[responsibleUsersField]).toHaveLength(1);
                expect(response.body[responsibleUsersField][0]).toBe(getAuthObject(1).accountName.toLocaleLowerCase());
                expect(response.body[connectionsToLowerField]).toHaveLength(1);
                expect(response.body[connectionsToLowerField][0]).toHaveProperty(descriptionField, 'xTest');
                items0.push(response.body);
            });
    });

    it('should read the full configuration item again and have one connection to upper more than before', async () => {
        return request(app)
            .get('/rest/configurationitem/' + items1[0][idField] + '/full')
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body[connectionsToUpperField]).toHaveLength(5);
                expect(response.body[connectionsToLowerField]).toHaveLength(0);
            });
    });

    it('should find one less item as connectable for rule', async () => {
        return request(app)
            .get('/rest/configurationitems/connectableasloweritem/rule/' + rule[idField])
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(9);
        });
    });

    it('should find one less lower items as connectable for rule and item', async () => {
        return request(app)
            .get('/rest/configurationitems/connectableasloweritem/item/' + items2[0][idField] + '/rule/' + rule[idField])
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(9);
        });
    });

    it('should find one less lower items as connectable for rule and item', async () => {
        return request(app)
            .get('/rest/configurationitems/connectableasloweritem/item/' + items2[0][idField] + '/rule/' + rule[idField])
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(9);
        });
    });

    it('should detect a non existing item id', async () => {
        return request(app)
            .get('/rest/configurationitems/connectableasloweritem/item/' + validButNotExistingMongoId + '/rule/' + rule[idField])
            .set('Authorization', readerToken)
            .expect(400);
    });

    it('should get a validation error for an invalid item id', async () => {
        return request(app)
            .get('/rest/configurationitems/connectableasloweritem/item/' + notAMongoId + '/rule/' + notAMongoId)
            .set('Authorization', readerToken)
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.data.errors).toHaveLength(2)
        });
    });

    it('should get one less items to connect one item to', async () => {
        return request(app)
            .get('/rest/configurationitems/available/' + rule[idField] + '/1')
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(9);
        });
    });

    it('should get no items to connect more item to than allowed in the rule', async () => {
        return request(app)
            .get('/rest/configurationitems/available/' + rule[idField] + '/' + (rule[maxConnectionsToUpperField] + 1))
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(0);
        });
    });

    it('should not find anything for a non existing rule id', async () => {
        return request(app)
            .get('/rest/configurationitems/available/' + validButNotExistingMongoId + '/1')
            .set('Authorization', readerToken)
            .expect(400);
    });

    it('should get a validation error for an invalid rule id and number', async () => {
        return request(app)
            .get('/rest/configurationitems/available/' + notAMongoId + '/0')
            .set('Authorization', readerToken)
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.data.errors).toHaveLength(2);
        });
    });

    it('should get items by id', async () => {
        const itemIds = items0.map(i => i[idField]).join(',');
        return request(app)
            .get('/rest/configurationitems/' + itemIds)
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(items0.length);
        });
    });

    it('should get validation error with invalid item id', async () => {
        const itemIds = [...items0.map(i => i[idField]), notAMongoId].join(',');
        return request(app)
            .get('/rest/configurationitems/' + itemIds)
            .set('Authorization', readerToken)
            .expect(400);
    });

    it('should get validation error with non existing item id', async () => {
        const itemIds = [...items0.map(i => i[idField]), validButNotExistingMongoId].join(',');
        return request(app)
            .get('/rest/configurationitems/' + itemIds)
            .set('Authorization', readerToken)
            .expect(400);
    });

    it('should get items with connections by id', async () => {
        const itemIds = items0.map(i => i[idField]).join(',');
        return request(app)
            .get('/rest/configurationitems/' + itemIds + '/full')
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(items0.length);
        });
    });

    it('should get validation error with invalid item id', async () => {
        const itemIds = [...items0.map(i => i[idField]), notAMongoId].join(',');
        return request(app)
            .get('/rest/configurationitems/' + itemIds + '/full')
            .set('Authorization', readerToken)
            .expect(400);
    });

    it('should get validation error with non existing item id', async () => {
        const itemIds = [...items0.map(i => i[idField]), validButNotExistingMongoId].join(',');
        return request(app)
            .get('/rest/configurationitems/' + itemIds + '/full')
            .set('Authorization', readerToken)
            .expect(400);
    });

});
