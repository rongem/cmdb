const { expect } = require('chai')
const {
    idField,
    typeIdField,
    descriptionField,
    upperItemIdField,
    lowerItemIdField,
    ruleIdField,
    connectionTypeIdField,
    validationExpressionField,
} = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getAuthObject, getAllowedAttributeTypes, getDisallowedAttributeTypes } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken, readerToken;
let itemTypes, items0, items1, items2, rules0, rules2;
let conn;

describe('Connections', function() {
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
            .send(getAuthObject(0))
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                readerToken = 'Bearer ' + res.body.token;
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
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(2);
                itemTypes = res.body;
                done();
            });
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/configurationitems/bytypes/' + itemTypes[0][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                items0 = res.body;
                done();
            });
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/configurationitems/bytypes/' + itemTypes[1][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                items1 = res.body;
                done();
            });
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/configurationitems/bytypes/' + itemTypes[2][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                items2 = res.body;
                done();
            });
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/configurationitems/bytypes/' + itemTypes[2][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                items2 = res.body;
                done();
            });
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/connectionrules/forupperitemtype/' + itemTypes[0][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property('length', 1);
                rules0 = res.body[0];
                done();
            });
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/connectionrules/forupperitemtype/' + itemTypes[2][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property('length', 1);
                rules2 = res.body[0];
                done();
            });
    });

    it('should not be able to create a connection as reader', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', readerToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'Test',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
        });
    });

    it('should not create a connection with an invalid description', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'Test',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should create a connection', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                conn = res.body[0];
                done();
        });
    });

    it('should not create a duplicate connection', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should not create a connection to another lower item', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[1][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest2',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should create a connection to another upper item', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[1][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest 2',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                done();
        });
    });

    it('should create a connection to another upper item', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[2][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest 3',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                done();
        });
    });

    it('should not create a connection to another upper item because of exceeding the maximum number', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[2][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest 4',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

});

