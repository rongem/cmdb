const { expect } = require('chai');
const {
    upperItemTypeIdField,
    lowerItemTypeIdField,
    connectionTypeIdField,
    validationExpressionField,
    idField,
    maxConnectionsToLowerField,
    maxConnectionsToUpperField
} = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getToken, validButNotExistingMongoId, notAMongoId } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken;
let itemTypes, connectionTypes;
let connectionRule;

describe('Connection Rules', function() {
    before(function() {
        adminToken = getToken('admin');
        editToken = getToken('editor');
        server = serverexp.default()
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/itemtypes')
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(1);
                itemTypes = res.body;
                done();
            });
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/connectiontypes')
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(1);
                connectionTypes = res.body;
                done();
            });
    });

    it('should not create connection rule as editor', function(done) {
        chai.request(server)
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
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should not create connection rule with illegal values', function(done) {
        chai.request(server)
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
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                expect(res.body.data.errors).to.be.a('array');
                const params = res.body.data.errors.map(e => e.path);
                expect(params).to.include(maxConnectionsToUpperField);
                expect(params).to.include(maxConnectionsToLowerField);
                expect(params).to.include(validationExpressionField);
                expect(params).to.include(upperItemTypeIdField);
                expect(params).to.include(lowerItemTypeIdField);
                expect(params).to.include(connectionTypeIdField);
                done();
            });
    });

    it('should create a connection rule', function(done) {
        chai.request(server)
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
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                expect(res.body).to.have.property(upperItemTypeIdField, itemTypes[0][idField]);
                expect(res.body).to.have.property(lowerItemTypeIdField, itemTypes[1][idField]);
                expect(res.body).to.have.property(connectionTypeIdField, connectionTypes[0][idField]);
                expect(res.body).to.have.property(maxConnectionsToLowerField, 1);
                expect(res.body).to.have.property(maxConnectionsToUpperField, 1);
                expect(res.body).to.have.property(validationExpressionField, '^.*$');
                connectionRule = res.body;
                done();
            });
    });

    it('should read the connection rule', function(done) {
        chai.request(server)
            .get('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property(upperItemTypeIdField, itemTypes[0][idField]);
                expect(res.body).to.have.property(lowerItemTypeIdField, itemTypes[1][idField]);
                expect(res.body).to.have.property(connectionTypeIdField, connectionTypes[0][idField]);
                expect(res.body).to.have.property(maxConnectionsToLowerField, 1);
                expect(res.body).to.have.property(maxConnectionsToUpperField, 1);
                expect(res.body).to.have.property(validationExpressionField, '^.*$');
                done();
            });
    });

    it('should read the connection rule by content', function(done) {
        chai.request(server)
            .get('/rest/connectionrule/upperItemType/' + connectionRule[upperItemTypeIdField] +
                '/connectionType/' + connectionRule[connectionTypeIdField] +
                '/lowerItemType/' + connectionRule[lowerItemTypeIdField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property(upperItemTypeIdField, itemTypes[0][idField]);
                expect(res.body).to.have.property(lowerItemTypeIdField, itemTypes[1][idField]);
                expect(res.body).to.have.property(connectionTypeIdField, connectionTypes[0][idField]);
                expect(res.body).to.have.property(maxConnectionsToLowerField, 1);
                expect(res.body).to.have.property(maxConnectionsToUpperField, 1);
                expect(res.body).to.have.property(validationExpressionField, '^.*$');
                done();
            });
    });

    it('should get the correct lower item type', function(done) {
        chai.request(server)
            .get('/rest/itemtypes/forupper/' + connectionRule[upperItemTypeIdField] + '/connectiontype/' + connectionRule[connectionTypeIdField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 1);
                expect(res.body[0]).to.have.property(idField, connectionRule[lowerItemTypeIdField]);
                done();
            });
    });

    it('should get the correct upper item type', function(done) {
        chai.request(server)
            .get('/rest/itemtypes/forlower/' + connectionRule[lowerItemTypeIdField] + '/connectiontype/' + connectionRule[connectionTypeIdField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 1);
                expect(res.body[0]).to.have.property(idField, connectionRule[upperItemTypeIdField]);
                done();
            });
    });

    it('should get an error reading a connection rule with a non existing id', function(done) {
        chai.request(server)
            .get('/rest/connectionrule/' + validButNotExistingMongoId)
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(404);
                done();
            });
    });

    it('should get a validation error reading a connection rule with an invalid id', function(done) {
        chai.request(server)
            .get('/rest/connectionrule/' + notAMongoId)
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                done();
            });
    });

    it('should mark a connection type with rules as not deletable', function(done) {
        chai.request(server)
            .get('/rest/connectionType/' + connectionRule[connectionTypeIdField] + '/candelete')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.equal(false);
                done();
            });
    });

    it('should not delete a connection type with rules', function(done) {
        chai.request(server)
            .delete('/rest/connectiontype/' + connectionRule[connectionTypeIdField])
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                done();
            });
    });

    it('should mark item type without items, but with rules, as not deletable', function(done) {
        chai.request(server)
            .get('/rest/itemType/' + connectionRule[upperItemTypeIdField] + '/candelete')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.equal(false);
                done();
            });
    });

    it('should not delete an item type with rules', function(done) {
        chai.request(server)
            .delete('/rest/itemType/' + connectionRule[upperItemTypeIdField])
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                done();
            });
    });

    it('should not create a duplicate connection rule', function(done) {
        chai.request(server)
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
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                done();
            });
    });

    it('should detect an update with no changes', function(done) {
        chai.request(server)
            .put('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', adminToken)
            .send({
                ...connectionRule,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(304);
                done();
            });
    });

    it('should not update when changing types', function(done) {
        chai.request(server)
            .put('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', adminToken)
            .send({
                ...connectionRule,
                [upperItemTypeIdField]: itemTypes[1][idField],
                [lowerItemTypeIdField]: itemTypes[2][idField],
                [connectionTypeIdField]: connectionTypes[1][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                expect(res.body.data).to.have.property('oldUpperItemType', itemTypes[0][idField]);
                expect(res.body.data).to.have.property('oldLowerItemType', itemTypes[1][idField]);
                expect(res.body.data).to.have.property('oldConnectionType', connectionTypes[0][idField]);
                done();
            });
    });

    it('should detect an update with illegal values', function(done) {
        chai.request(server)
            .put('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', adminToken)
            .send({
                ...connectionRule,
                [maxConnectionsToUpperField]: -1,
                [maxConnectionsToLowerField]: 0,
                [validationExpressionField]: '',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                expect(res.body.data.errors).to.be.a('array');
                const params = res.body.data.errors.map(e => e.path);
                expect(params).to.include(maxConnectionsToUpperField);
                expect(params).to.include(maxConnectionsToLowerField);
                expect(params).to.include(validationExpressionField);
                done();
            });
    });

    it('should not update a connection rule as an editor', function(done) {
        chai.request(server)
            .put('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', editToken)
            .send({
                ...connectionRule,
                [maxConnectionsToUpperField]: 10,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should update a connection rule', function(done) {
        chai.request(server)
            .put('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', adminToken)
            .send({
                ...connectionRule,
                [maxConnectionsToUpperField]: 100,
                [maxConnectionsToLowerField]: 110,
                [validationExpressionField]: '^x.*$',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property(upperItemTypeIdField, connectionRule[upperItemTypeIdField]);
                expect(res.body).to.have.property(lowerItemTypeIdField, connectionRule[lowerItemTypeIdField]);
                expect(res.body).to.have.property(connectionTypeIdField, connectionRule[connectionTypeIdField]);
                expect(res.body).to.have.property(maxConnectionsToLowerField, 110);
                expect(res.body).to.have.property(maxConnectionsToUpperField, 100);
                expect(res.body).to.have.property(validationExpressionField, '^x.*$');
                connectionRule = res.body;
                done();
            });
    });

    it('should not delete a connection rule as an editor', function(done) {
        chai.request(server)
            .delete('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should mark a connection rule without connections as deletable', function(done) {
        chai.request(server)
            .get('/rest/connectionrule/' + connectionRule[idField] + '/candelete')
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.true;
                done();
            });
    });

    it('should get an error deleting a non existing connection rule', function(done) {
        chai.request(server)
            .delete('/rest/connectionrule/' + validButNotExistingMongoId)
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(404);
                done();
            });
    });

    it('should get a validation error deleting an invalid id', function(done) {
        chai.request(server)
            .delete('/rest/connectionrule/' + notAMongoId)
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                done();
            });
    });

    it('should delete a connection rule', function(done) {
        chai.request(server)
            .delete('/rest/connectionrule/' + connectionRule[idField])
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it('should create first connection rule', function(done) {
        chai.request(server)
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
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                done();
            });
    });

    it('should create second connection rule', function(done) {
        chai.request(server)
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
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                done();
            });
    });

    it('should retrieve 2 connection rules', function(done) {
        chai.request(server)
            .get('/rest/connectionrules')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 2);
                done();
            });
    });

    it('should retrieve 1 connection rule for upper item type', function(done) {
        chai.request(server)
            .get('/rest/connectionrules/forupperitemtype/' + itemTypes[2][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 1);
                done();
            });
    });

    it('should retrieve 2 connection rules for lower item type', function(done) {
        chai.request(server)
            .get('/rest/connectionrules/forloweritemtype/' + itemTypes[1][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 2);
                done();
            });
    });

    it('should retrieve 1 connection rule for upper and lower item type', function(done) {
        chai.request(server)
            .get('/rest/connectionrules/forupperitemtype/' + itemTypes[0][idField] + '/forloweritemtype/' + itemTypes[1][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 1);
                done();
            });
    });

    it('should retrieve 1 connection rule for item type', function(done) {
        chai.request(server)
            .get('/rest/connectionrules/foritemtype/' + itemTypes[0][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 1);
                done();
            });
    });

    it('should retrieve 1 connection type for item type', function(done) {
        chai.request(server)
            .get('/rest/connectiontypes/alloweddownward/itemtype/' + itemTypes[0][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 1);
                done();
            });
    });

    it('should retrieve an error for a non existing item type', function(done) {
        chai.request(server)
            .get('/rest/connectiontypes/alloweddownward/itemtype/' + validButNotExistingMongoId)
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(404);
                done();
            });
    });

    it('should get a validation error for an invalid id', function(done) {
        chai.request(server)
            .get('/rest/connectiontypes/alloweddownward/itemtype/' + notAMongoId)
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                done();
            });
    });
});
