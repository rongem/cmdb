const { expect } = require('chai')
const {
    idField,
    typeIdField,
    descriptionField,
    upperItemIdField,
    lowerItemIdField,
    ruleIdField,
    connectionTypeIdField,
    responsibleUsersField,
} = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getToken, getAuthObject } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken, readerToken;
let itemTypes, items0, items1, items2, rules0, rules2;
let conn;

describe('Connections', function() {
    before(function() {
        adminToken = getToken('admin');
        readerToken = getToken('reader');
        editToken = getToken('editor');
        server = serverexp.default()
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
                conn = res.body;
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

    it('should not create a connection to another upper item, because of exceeding the maximum number', function(done) {
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

    it('should not be able to update a connection description as reader', function(done) {
        chai.request(server)
            .put('/rest/connection/' + conn[idField] + '/description')
            .set('Authorization', readerToken)
            .send({
                [descriptionField]: 'xTest 1a',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
        });
    });

    it('should not update a connection description that does not comply to the validation expression of the rule', function(done) {
        chai.request(server)
            .put('/rest/connection/' + conn[idField] + '/description')
            .set('Authorization', editToken)
            .send({
                [descriptionField]: 'Test 1a',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should update a connection description', function(done) {
        chai.request(server)
            .put('/rest/connection/' + conn[idField] + '/description')
            .set('Authorization', editToken)
            .send({
                [descriptionField]: 'xTest 1a',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                conn = res.body;
                done();
        });
    });

    it('should abandon responsibility for the configuration item ', function(done) {
        chai.request(server)
            .delete('/rest/configurationItem/' + conn[upperItemIdField] + '/responsibility')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[responsibleUsersField]).not.to.include(getAuthObject(1).accountName.toLocaleLowerCase());
                done();
            });
    });

    it('should not update a connection description, if user is not responsible for upper item', function(done) {
        chai.request(server)
            .put('/rest/connection/' + conn[idField] + '/description')
            .set('Authorization', editToken)
            .send({
                [descriptionField]: 'xTest 1b',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
        });
    });

    it('should not delete a connection, if user is not responsible for upper item', function(done) {
        chai.request(server)
            .delete('/rest/connection/' + conn[idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
        });
    });

    it('should not delete a connection description as reader', function(done) {
        chai.request(server)
            .delete('/rest/connection/' + conn[idField])
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
        });
    });

    it('should take responsibility for the configuration item ', function(done) {
        chai.request(server)
            .post('/rest/configurationItem/' + conn[upperItemIdField] + '/responsibility')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[responsibleUsersField]).to.include(getAuthObject(1).accountName.toLocaleLowerCase());
                done();
            });
    });

    it('should delete the connection', function(done) {
        chai.request(server)
            .delete('/rest/connection/' + conn[idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                done();
        });
    });

    it('should abandon responsibility for the configuration item ', function(done) {
        chai.request(server)
            .delete('/rest/configurationItem/' + items2[0][idField] + '/responsibility')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[responsibleUsersField]).not.to.include(getAuthObject(1).accountName.toLocaleLowerCase());
                done();
            });
    });

    it('should not create a connection without responsibility for the upper item', function(done) {
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
                expect(res.status).to.be.equal(403);
                done();
        });
    });

    it('should take responsibility for the configuration item again', function(done) {
        chai.request(server)
            .post('/rest/configurationItem/' + conn[upperItemIdField] + '/responsibility')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[responsibleUsersField]).to.include(getAuthObject(1).accountName.toLocaleLowerCase());
                done();
            });
    });

});

describe('Connection rules and connections', function() {

    it('should mark a connection rule with connections as not deletable', function(done) {
        chai.request(server)
            .get('/rest/connectionrule/' + rules2[idField] + '/candelete')
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('should not delete a connection rule with active connections', function(done) {
        chai.request(server)
            .delete('/rest/connectionrule/' + rules2[idField])
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

});

