const { expect } = require('chai')
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
const { getAuthObject } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken;
let itemTypes, connectionTypes;
let connectionRule;

describe('Connection Rules', function() {
    before(function(done) {
        server = serverexp.default()
        chai.request(server)
            .post('/login')
            .send(getAuthObject(2))
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                adminToken = 'Bearer ' + res.body.token;
                done();
            });
    });

    before(function(done) {
        chai.request(server)
            .post('/login')
            .send(getAuthObject(1))
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                editToken = 'Bearer ' + res.body.token;
                done();
            });
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
            })
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
                console.log(res.body);
                if (res.body.data) {
                    console.log(res.body.data.errors);
                }
                expect(res.status).to.be.equal(201);
                expect(res.body).to.have.property(upperItemTypeIdField, itemTypes[0][idField]);
                expect(res.body).to.have.property(lowerItemTypeIdField, itemTypes[1][idField]);
                expect(res.body).to.have.property(connectionTypeIdField, connectionTypes[0][idField]);
                expect(res.body).to.have.property(maxConnectionsToLowerField, 1);
                expect(res.body).to.have.property(maxConnectionsToUpperField, 1);
                expect(res.body).to.have.property(validationExpressionField, '^.*$');
                connectionRule = res.body;
                done();
            })
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
                expect(res.status).to.be.equal(422);
                done();
            })
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
                console.log(connectionRule, res.body);
                expect(res.status).to.be.equal(304);
                done();
            })
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
            })
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
            })
    });

});
