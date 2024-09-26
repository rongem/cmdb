import request from 'supertest';
import { app } from '../../app';
import {
    idField,
    typeIdField,
    descriptionField,
    upperItemIdField,
    lowerItemIdField,
    ruleIdField,
    connectionTypeIdField,
    responsibleUsersField,
    validationExpressionField,
    maxConnectionsToUpperField
} from '../../util/fields.constants';
import { getAuthObject, validButNotExistingMongoId, notAMongoId } from '../../test/functions';
import { ItemType } from '../../models/meta-data/item-type.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { Connection } from '../../models/item-data/connection.model';

let adminToken: string, editToken: string, readerToken: string;
let itemTypes: ItemType[]
let items0: ConfigurationItem[], items1: ConfigurationItem[], items2: ConfigurationItem[]
let rules0: ConnectionRule, rules2: ConnectionRule;
let conn: Connection;

describe('Connections', function() {
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
    });

    it('should read existing item types', () => {
        return request(app)
            .get('/rest/itemtypes')
            .set('Authorization', adminToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(1);
                itemTypes = response.body;
            });
    });

    it('should get configuration by type', () => {
        return request(app)
            .get('/rest/configurationitems/bytypes/' + itemTypes[0][idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                items0 = response.body;
            });
    });

    it('should get configuration by type', () => {
        return request(app)
            .get('/rest/configurationitems/bytypes/' + itemTypes[1][idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                items1 = response.body;
            });
    });

    it('should get configuration by type', () => {
        return request(app)
            .get('/rest/configurationitems/bytypes/' + itemTypes[2][idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                items2 = response.body;
            });
    });

    it('should get configuration by type', () => {
        return request(app)
            .get('/rest/configurationitems/bytypes/' + itemTypes[2][idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                items2 = response.body;
            });
    });

    it('should get connection rules for item type', () => {
        return request(app)
            .get('/rest/connectionrules/forupperitemtype/' + itemTypes[0][idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
                rules0 = response.body[0];
            });
    });

    it('should get connection rules for item type', () => {
        return request(app)
            .get('/rest/connectionrules/forupperitemtype/' + itemTypes[2][idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
                rules2 = response.body[0];
            });
    });

    it('should find all created items as connectable for rule', () => {
        return request(app)
            .get('/rest/configurationitems/connectableasloweritem/rule/' + rules2[idField])
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(10);
        });
    });

    it('should not find items when using a not existing rule id', () => {
        return request(app)
            .get('/rest/configurationitems/connectableasloweritem/rule/' + validButNotExistingMongoId)
            .set('Authorization', readerToken)
            .expect(400);
    });

    it('should get a validation error when using an invalid rule id', () => {
        return request(app)
            .get('/rest/configurationitems/connectableasloweritem/rule/' + notAMongoId)
            .set('Authorization', readerToken)
            .expect(400);
    });

    it('should not be able to create a connection as reader', () => {
        return request(app)
            .post('/rest/connection')
            .set('Authorization', readerToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'Test',
            })
            .expect(403);
    });

    it('should not create a connection with an invalid description', () => {
        return request(app)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'Test',
            })
            .expect(400);
    });

    it('should create a connection', () => {
        return request(app)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest',
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(idField);
                expect(response.body).toHaveProperty(upperItemIdField, items2[0][idField]);
                expect(response.body).toHaveProperty(lowerItemIdField, items1[0][idField]);
                expect(response.body).toHaveProperty(ruleIdField, rules2[idField]);
                expect(response.body).toHaveProperty(typeIdField, rules2[connectionTypeIdField]);
                expect(response.body).toHaveProperty(descriptionField, 'xTest');
                conn = response.body;
        });
    });

    it('should get 1 connection as count for item', () => {
        return request(app)
            .get('/rest/configurationitem/' + items2[0][idField] + '/connections')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
                expect(response.body[0][idField]).toBe(conn[idField]);
        });
    });

    it('should get 1 connection to lower as count for item', () => {
        return request(app)
            .get('/rest/configurationitem/' + items2[0][idField] + '/connections/toLower')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
                expect(response.body[0][idField]).toBe(conn[idField]);
        });
    });

    it('should get 1 connection to upper as count for item', () => {
        return request(app)
            .get('/rest/configurationitem/' + items1[0][idField] + '/connections/toUpper')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
                expect(response.body[0][idField]).toBe(conn[idField]);
        });
    });

    it('should read the connection', () => {
        return request(app)
            .get('/rest/connection/' + conn[idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(idField, conn[idField]);
                expect(response.body).toHaveProperty(upperItemIdField, conn[upperItemIdField]);
                expect(response.body).toHaveProperty(lowerItemIdField, conn[lowerItemIdField]);
                expect(response.body).toHaveProperty(ruleIdField, conn[ruleIdField]);
                expect(response.body).toHaveProperty(typeIdField, conn[typeIdField]);
                expect(response.body).toHaveProperty(descriptionField, conn[descriptionField]);
        });
    });

    it('should get 1 connection for the rule', () => {
        return request(app)
            .get('/rest/connectionrule/' + conn[ruleIdField] + '/connections/count')
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body).toBe(1);
        });
    });

    it('should read the connection by content', () => {
        return request(app)
            .get('/rest/connection/upperItem/' + conn[upperItemIdField] + '/connectiontype/' + conn[typeIdField] + '/loweritem/' + conn[lowerItemIdField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(idField, conn[idField]);
                expect(response.body).toHaveProperty(upperItemIdField, conn[upperItemIdField]);
                expect(response.body).toHaveProperty(lowerItemIdField, conn[lowerItemIdField]);
                expect(response.body).toHaveProperty(ruleIdField, conn[ruleIdField]);
                expect(response.body).toHaveProperty(typeIdField, conn[typeIdField]);
                expect(response.body).toHaveProperty(descriptionField, conn[descriptionField]);
        });
    });

    it('should get a validation error reading the connection by content with invalid ids', () => {
        return request(app)
            .get('/rest/connection/upperItem/' + notAMongoId + '/connectiontype/' + notAMongoId + '/loweritem/' + notAMongoId)
            .set('Authorization', editToken)
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.data.errors).toHaveLength(3);
        });
    });

    it('should read the connection', () => {
        return request(app)
            .get('/rest/connection/' + conn[idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(idField, conn[idField]);
                expect(response.body).toHaveProperty(upperItemIdField, items2[0][idField]);
                expect(response.body).toHaveProperty(lowerItemIdField, items1[0][idField]);
                expect(response.body).toHaveProperty(ruleIdField, rules2[idField]);
                expect(response.body).toHaveProperty(typeIdField, rules2[connectionTypeIdField]);
                expect(response.body).toHaveProperty(descriptionField, 'xTest');
        });
    });

    it('should not read a connection with a non existing id', () => {
        return request(app)
            .get('/rest/connection/' + validButNotExistingMongoId)
            .set('Authorization', readerToken)
            .expect(404);
    });

    it('should get a validation error reading a connection with an invalid id', () => {
        return request(app)
            .get('/rest/connection/' + notAMongoId)
            .set('Authorization', readerToken)
            .expect(400);
    });

    it('should not create a duplicate connection', () => {
        return request(app)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest',
            })
            .expect(400);
    });

    it('should not create a connection to another lower item', () => {
        return request(app)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[1][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest2',
            })
            .expect(400);
    });

    it('should create a connection to another upper item', () => {
        return request(app)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[1][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest 2',
            })
            .expect(201);
    });

    it('should create a connection to another upper item', () => {
        return request(app)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[2][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest 3',
            })
            .expect(201);
    });

    it('should create a connection to another upper item', () => {
        return request(app)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[3][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest 4',
            })
            .expect(201);
    });

    it('should create a connection to another upper item', () => {
        return request(app)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[4][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest 5',
            })
            .expect(201);
    });

    it('should not create a connection to another upper item, because of exceeding the maximum number', () => {
        return request(app)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[5][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest 6',
            })
            .expect(400);
    });

    it('should not be able to update a connection description as reader', () => {
        return request(app)
            .put('/rest/connection/' + conn[idField] + '/description')
            .set('Authorization', readerToken)
            .send({
                [descriptionField]: 'xTest 1a',
            })
            .expect(403);
    });

    it('should not update a connection description that does not comply to the validation expression of the rule', () => {
        return request(app)
            .put('/rest/connection/' + conn[idField] + '/description')
            .set('Authorization', editToken)
            .send({
                [descriptionField]: 'Test 1a',
            })
            .expect(400);
    });

    it('should update a connection description', () => {
        return request(app)
            .put('/rest/connection/' + conn[idField] + '/description')
            .set('Authorization', editToken)
            .send({
                [descriptionField]: 'xTest 1a',
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                conn = response.body;
        });
    });

    it('should abandon responsibility for the configuration item ', () => {
        return request(app)
            .delete('/rest/configurationItem/' + conn[upperItemIdField] + '/responsibility')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body[responsibleUsersField]).not.toContain(getAuthObject(1).accountName.toLocaleLowerCase());
            });
    });

    it('should not update a connection description, if user is not responsible for upper item', () => {
        return request(app)
            .put('/rest/connection/' + conn[idField] + '/description')
            .set('Authorization', editToken)
            .send({
                [descriptionField]: 'xTest 1b',
            })
            .expect(403);
    });

    it('should not delete a connection, if user is not responsible for upper item', () => {
        return request(app)
            .delete('/rest/connection/' + conn[idField])
            .set('Authorization', editToken)
            .expect(403);
    });

    it('should not delete a connection description as reader', () => {
        return request(app)
            .delete('/rest/connection/' + conn[idField])
            .set('Authorization', readerToken)
            .expect(403);
    });

    it('should take responsibility for the configuration item ', () => {
        return request(app)
            .post('/rest/configurationItem/' + conn[upperItemIdField] + '/responsibility')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body[responsibleUsersField]).toContain(getAuthObject(1).accountName.toLocaleLowerCase());
            });
    });

    it('should delete the connection', () => {
        return request(app)
            .delete('/rest/connection/' + conn[idField])
            .set('Authorization', editToken)
            .expect(200);
    });

    it('should read all connections', () => {
        return request(app)
            .get('/rest/connections')
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.connections).toHaveLength(response.body.totalConnections);
                expect(response.body.connections[0]).toHaveProperty(typeIdField);
        });
    });

    it('should abandon responsibility for the configuration item ', () => {
        return request(app)
            .delete('/rest/configurationItem/' + items2[0][idField] + '/responsibility')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body[responsibleUsersField]).not.toContain(getAuthObject(1).accountName.toLocaleLowerCase());
            });
    });

    it('should not create a connection without responsibility for the upper item', () => {
        return request(app)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest',
            })
            .expect(403);
    });

    it('should take responsibility for the configuration item again', () => {
        return request(app)
            .post('/rest/configurationItem/' + conn[upperItemIdField] + '/responsibility')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body[responsibleUsersField]).toContain(getAuthObject(1).accountName.toLocaleLowerCase());
            });
    });

    it('should find lower items as connectable for rule and item', () => {
        return request(app)
            .get('/rest/configurationitems/connectableasloweritem/item/' + items2[0][idField] + '/rule/' + rules2[idField])
            .set('Authorization', readerToken)
            .expect(200)
            .then(response => {
                expect(response.body).toHaveLength(10);
        });
    });

    it('should find upper items as connectable for rule and item', () => {
        return request(app)
            .get('/rest/configurationitems/connectableasupperitem/item/' + items1[1][idField] + '/rule/' + rules2[idField])
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(7);
        });
    });

});

describe('Connection rules and connections', function() {

    it('should mark a connection rule with connections as not deletable', () => {
        return request(app)
            .get('/rest/connectionrule/' + rules2[idField] + '/candelete')
            .set('Authorization', adminToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toBe(false);
            });
    });

    it('should not delete a connection rule with active connections', () => {
        return request(app)
            .delete('/rest/connectionrule/' + rules2[idField])
            .set('Authorization', adminToken)
            .expect(400);
    });

    it('should not update a connection rule, when validation expression would not fit', () => {
        return request(app)
            .put('/rest/connectionrule/' + rules2[idField])
            .set('Authorization', adminToken)
            .send({
                ...rules2,
                [validationExpressionField]: '^xxx.*$',
            })
            .expect(409);
    });

    it('should not update a connection rule, when number of existing connections are larger than allowed', () => {
        return request(app)
            .put('/rest/connectionrule/' + rules2[idField])
            .set('Authorization', adminToken)
            .send({
                ...rules2,
                [maxConnectionsToUpperField]: 1,
            })
            .expect(409);
    });

});

