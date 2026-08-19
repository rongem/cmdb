import request from 'supertest';
import { app } from '../../app';
import {
    upperItemTypeIdField,
    lowerItemTypeIdField,
    connectionTypeIdField,
    validationExpressionField,
    idField,
    maxConnectionsToLowerField,
    maxConnectionsToUpperField
} from '../../util/fields.constants';
import { getAuthObject, validButNotExistingMongoId, notAMongoId } from '../../test/functions';
import { ItemType } from '../../models/meta-data/item-type.model';
import { ConnectionType } from '../../models/meta-data/connection-type.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';

let adminToken: string, editToken: string;
let itemTypes: ItemType[], connectionTypes: ConnectionType[];
let connectionRule: ConnectionRule;

describe('Connection Rules', function() {
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

    it('should read existing connection types', () => {
        return request(app)
            .get('/rest/connectiontypes')
            .set('Authorization', adminToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(1);
                connectionTypes = response.body;
            });
    });

    it('should not create connection rule as editor', () => {
        return request(app)
            .post('/rest/connectionrule')
            .set('Authorization', editToken)
            .send({
                [upperItemTypeIdField]: itemTypes[0][idField],
                [lowerItemTypeIdField]: itemTypes[1][idField],
                [connectionTypeIdField]: connectionTypes[0][idField],
                [maxConnectionsToLowerField]: 1,
                [maxConnectionsToUpperField]: 50,
                [validationExpressionField]: '^.*$',
            })
            .expect(403);
    });

    it('should not create connection rule with illegal values', () => {
        return request(app)
            .post('/rest/connectionrule')
            .set('Authorization', adminToken)
            .send({
                [upperItemTypeIdField]: validButNotExistingMongoId,
                [lowerItemTypeIdField]: validButNotExistingMongoId,
                [connectionTypeIdField]: validButNotExistingMongoId,
                [maxConnectionsToLowerField]: 10000,
                [maxConnectionsToUpperField]: 10000,
                [validationExpressionField]: '^)($',
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                const params = response.body.data.errors.map((e: { path: string; }) => e.path);
                expect(params).toContain(maxConnectionsToUpperField);
                expect(params).toContain(maxConnectionsToLowerField);
                expect(params).toContain(validationExpressionField);
                expect(params).toContain(upperItemTypeIdField);
                expect(params).toContain(lowerItemTypeIdField);
                expect(params).toContain(connectionTypeIdField);
            });
    });

    it('should create a connection rule', () => {
        return request(app)
            .post('/rest/connectionrule')
            .set('Authorization', adminToken)
            .send({
                [upperItemTypeIdField]: itemTypes[0][idField],
                [lowerItemTypeIdField]: itemTypes[1][idField],
                [connectionTypeIdField]: connectionTypes[0][idField],
                [maxConnectionsToLowerField]: 1,
                [maxConnectionsToUpperField]: 1,
                [validationExpressionField]: '^.*$',
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(upperItemTypeIdField, itemTypes[0][idField]);
                expect(response.body).toHaveProperty(lowerItemTypeIdField, itemTypes[1][idField]);
                expect(response.body).toHaveProperty(connectionTypeIdField, connectionTypes[0][idField]);
                expect(response.body).toHaveProperty(maxConnectionsToLowerField, 1);
                expect(response.body).toHaveProperty(maxConnectionsToUpperField, 1);
                expect(response.body).toHaveProperty(validationExpressionField, '^.*$');
                connectionRule = response.body;
            });
    });

    it('should read the connection rule', () => {
        return request(app)
            .get('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(upperItemTypeIdField, itemTypes[0][idField]);
                expect(response.body).toHaveProperty(lowerItemTypeIdField, itemTypes[1][idField]);
                expect(response.body).toHaveProperty(connectionTypeIdField, connectionTypes[0][idField]);
                expect(response.body).toHaveProperty(maxConnectionsToLowerField, 1);
                expect(response.body).toHaveProperty(maxConnectionsToUpperField, 1);
                expect(response.body).toHaveProperty(validationExpressionField, '^.*$');
            });
    });

    it('should read the connection rule by content', () => {
        return request(app)
            .get('/rest/connectionrule/upperItemType/' + connectionRule[upperItemTypeIdField] +
                '/connectionType/' + connectionRule[connectionTypeIdField] +
                '/lowerItemType/' + connectionRule[lowerItemTypeIdField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(upperItemTypeIdField, itemTypes[0][idField]);
                expect(response.body).toHaveProperty(lowerItemTypeIdField, itemTypes[1][idField]);
                expect(response.body).toHaveProperty(connectionTypeIdField, connectionTypes[0][idField]);
                expect(response.body).toHaveProperty(maxConnectionsToLowerField, 1);
                expect(response.body).toHaveProperty(maxConnectionsToUpperField, 1);
                expect(response.body).toHaveProperty(validationExpressionField, '^.*$');
            });
    });

    it('should get the correct lower item type', () => {
        return request(app)
            .get('/rest/itemtypes/forupper/' + connectionRule[upperItemTypeIdField] + '/connectiontype/' + connectionRule[connectionTypeIdField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
                expect(response.body[0]).toHaveProperty(idField, connectionRule[lowerItemTypeIdField]);
            });
    });

    it('should get the correct upper item type', () => {
        return request(app)
            .get('/rest/itemtypes/forlower/' + connectionRule[lowerItemTypeIdField] + '/connectiontype/' + connectionRule[connectionTypeIdField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
                expect(response.body[0]).toHaveProperty(idField, connectionRule[upperItemTypeIdField]);
            });
    });

    it('should get an error reading a connection rule with a non existing id', () => {
        return request(app)
            .get('/rest/connectionrule/' + validButNotExistingMongoId)
            .set('Authorization', adminToken)
            .expect(404);
    });

    it('should get a validation error reading a connection rule with an invalid id', () => {
        return request(app)
            .get('/rest/connectionrule/' + notAMongoId)
            .set('Authorization', adminToken)
            .expect(400);
    });

    it('should mark a connection type with rules as not deletable', () => {
        return request(app)
            .get('/rest/connectionType/' + connectionRule[connectionTypeIdField] + '/candelete')
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body).toBe(false);
            });
    });

    it('should not delete a connection type with rules', () => {
        return request(app)
            .delete('/rest/connectiontype/' + connectionRule[connectionTypeIdField])
            .set('Authorization', adminToken)
            .expect(400);
    });

    it('should mark item type without items, but with rules, as not deletable', () => {
        return request(app)
            .get('/rest/itemType/' + connectionRule[upperItemTypeIdField] + '/candelete')
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body).toBe(false);
            });
    });

    it('should not delete an item type with rules', () => {
        return request(app)
            .delete('/rest/itemType/' + connectionRule[upperItemTypeIdField])
            .set('Authorization', adminToken)
            .expect(400);
    });

    it('should not create a duplicate connection rule', () => {
        return request(app)
            .post('/rest/connectionrule')
            .set('Authorization', adminToken)
            .send({
                [upperItemTypeIdField]: itemTypes[0][idField],
                [lowerItemTypeIdField]: itemTypes[1][idField],
                [connectionTypeIdField]: connectionTypes[0][idField],
                [maxConnectionsToLowerField]: 1,
                [maxConnectionsToUpperField]: 50,
                [validationExpressionField]: '^.*$',
            })
            .expect(400);
    });

    it('should detect an update with no changes', () => {
        return request(app)
            .put('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', adminToken)
            .send({
                ...connectionRule,
            })
            .expect(304);
    });

    it('should not update when changing types', () => {
        return request(app)
            .put('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', adminToken)
            .send({
                ...connectionRule,
                [upperItemTypeIdField]: itemTypes[1][idField],
                [lowerItemTypeIdField]: itemTypes[2][idField],
                [connectionTypeIdField]: connectionTypes[1][idField],
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.data).toHaveProperty('oldUpperItemType', itemTypes[0][idField]);
                expect(response.body.data).toHaveProperty('oldLowerItemType', itemTypes[1][idField]);
                expect(response.body.data).toHaveProperty('oldConnectionType', connectionTypes[0][idField]);
            });
    });

    it('should detect an update with illegal values', () => {
        return request(app)
            .put('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', adminToken)
            .send({
                ...connectionRule,
                [maxConnectionsToUpperField]: -1,
                [maxConnectionsToLowerField]: 0,
                [validationExpressionField]: '',
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                const params = response.body.data.errors.map((e: { path: string; }) => e.path);
                expect(params).toContain(maxConnectionsToUpperField);
                expect(params).toContain(maxConnectionsToLowerField);
                expect(params).toContain(validationExpressionField);
            });
    });

    it('should not update a connection rule as an editor', () => {
        return request(app)
            .put('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', editToken)
            .send({
                ...connectionRule,
                [maxConnectionsToUpperField]: 10,
            })
            .expect(403);
    });

    it('should update a connection rule', () => {
        return request(app)
            .put('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', adminToken)
            .send({
                ...connectionRule,
                [maxConnectionsToUpperField]: 100,
                [maxConnectionsToLowerField]: 110,
                [validationExpressionField]: '^x.*$',
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(upperItemTypeIdField, connectionRule[upperItemTypeIdField]);
                expect(response.body).toHaveProperty(lowerItemTypeIdField, connectionRule[lowerItemTypeIdField]);
                expect(response.body).toHaveProperty(connectionTypeIdField, connectionRule[connectionTypeIdField]);
                expect(response.body).toHaveProperty(maxConnectionsToLowerField, 110);
                expect(response.body).toHaveProperty(maxConnectionsToUpperField, 100);
                expect(response.body).toHaveProperty(validationExpressionField, '^x.*$');
                connectionRule = response.body;
            });
    });

    it('should not delete a connection rule as an editor', () => {
        return request(app)
            .delete('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', editToken)
            .expect(403);
    });

    it('should mark a connection rule without connections as deletable', () => {
        return request(app)
            .get('/rest/connectionrule/' + connectionRule[idField] + '/candelete')
            .set('Authorization', adminToken)
            .expect(200)
            .then(response => {
                expect(response.body).toBe(true);
            });
    });

    it('should get an error deleting a non existing connection rule', () => {
        return request(app)
            .delete('/rest/connectionrule/' + validButNotExistingMongoId)
            .set('Authorization', adminToken)
            .expect(404);
    });

    it('should get a validation error deleting an invalid id', () => {
        return request(app)
            .delete('/rest/connectionrule/' + notAMongoId)
            .set('Authorization', adminToken)
            .expect(400);
    });

    it('should delete a connection rule', () => {
        return request(app)
            .delete('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', adminToken)
            .expect(200);
    });

    it('should create first connection rule', () => {
        return request(app)
            .post('/rest/connectionrule')
            .set('Authorization', adminToken)
            .send({
                [upperItemTypeIdField]: itemTypes[0][idField],
                [lowerItemTypeIdField]: itemTypes[1][idField],
                [connectionTypeIdField]: connectionTypes[0][idField],
                [maxConnectionsToLowerField]: 1,
                [maxConnectionsToUpperField]: 3,
                [validationExpressionField]: '^.*$',
            })
            .expect(201);
    });

    it('should create second connection rule', () => {
        return request(app)
            .post('/rest/connectionrule')
            .set('Authorization', adminToken)
            .send({
                [upperItemTypeIdField]: itemTypes[2][idField],
                [lowerItemTypeIdField]: itemTypes[1][idField],
                [connectionTypeIdField]: connectionTypes[0][idField],
                [maxConnectionsToLowerField]: 1,
                [maxConnectionsToUpperField]: 5,
                [validationExpressionField]: '^x.*$',
            })
            .expect(201);
    });

    it('should retrieve 2 connection rules', () => {
        return request(app)
            .get('/rest/connectionrules')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(2);
            });
    });

    it('should retrieve 1 connection rule for upper item type', () => {
        return request(app)
            .get('/rest/connectionrules/forupperitemtype/' + itemTypes[2][idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
            });
    });

    it('should retrieve 2 connection rules for lower item type', () => {
        return request(app)
            .get('/rest/connectionrules/forloweritemtype/' + itemTypes[1][idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(2);
            });
    });

    it('should retrieve 1 connection rule for upper and lower item type', () => {
        return request(app)
            .get('/rest/connectionrules/forupperitemtype/' + itemTypes[0][idField] + '/forloweritemtype/' + itemTypes[1][idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
            });
    });

    it('should retrieve 1 connection rule for item type', () => {
        return request(app)
            .get('/rest/connectionrules/foritemtype/' + itemTypes[0][idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
            });
    });

    it('should retrieve 1 connection type for item type', () => {
        return request(app)
            .get('/rest/connectiontypes/alloweddownward/itemtype/' + itemTypes[0][idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
            });
    });

    it('should retrieve an error for a non existing item type', () => {
        return request(app)
            .get('/rest/connectiontypes/alloweddownward/itemtype/' + validButNotExistingMongoId)
            .set('Authorization', editToken)
            .expect(404);
    });

    it('should get a validation error for an invalid id', () => {
        return request(app)
            .get('/rest/connectiontypes/alloweddownward/itemtype/' + notAMongoId)
            .set('Authorization', editToken)
            .expect(400);
    });
});
