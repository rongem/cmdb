const { expect } = require('chai')
const { nameField, reverseNameField, idField } = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getAuthObject } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken;
const forwardName = 'is built into';
const reverseName = 'contains'
const secondForwardName = 'runs in';
const secondReverseName = 'provides';

describe('Connection types', function() {
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

    it('should create a connection type', function(done) {
        chai.request(server)
            .post('/rest/ConnectionType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: forwardName,
                [reverseNameField]: reverseName
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                expect(res.body).to.have.property(nameField, forwardName);
                expect(res.body).to.have.property(reverseNameField, reverseName);
                connectionType = res.body;
                done();
            });
    });

    it('should mark a connection type without rules as deletable', function(done) {
        chai.request(server)
            .get('/rest/connectionType/' + connectionType[idField] + '/candelete')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.equal(true);
                done();
            });
    });

    it('should not create a connection type of the same name and reverse name', function(done) {
        chai.request(server)
            .post('/rest/ConnectionType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: forwardName,
                [reverseNameField]: reverseName
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should not create a connection type without name', function(done) {
        chai.request(server)
            .post('/rest/ConnectionType')
            .set('Authorization', adminToken)
            .send({
                [reverseNameField]: reverseName
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should not create a connection type without reverse name', function(done) {
        chai.request(server)
            .post('/rest/ConnectionType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: forwardName,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should not be allowed to create a connection type as editor', function(done) {
        chai.request(server)
            .post('/rest/ConnectionType')
            .set('Authorization', editToken)
            .send({
                [nameField]: secondForwardName,
                [reverseNameField]: secondReverseName,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    let connectionType;

    it('should create another connection type', function(done) {
        chai.request(server)
            .post('/rest/ConnectionType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Connection Type 2',
                [reverseNameField]: secondReverseName,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                connectionType = res.body;
                done();
            });
    });

    it('should detect an update with no changes', function(done) {
        chai.request(server)
            .put('/rest/ConnectionType/' + connectionType.id)
            .set('Authorization', adminToken)
            .send({
                ...connectionType,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(304);
                done();
            });
    });

    it('should update a connection type', function(done) {
        chai.request(server)
            .put('/rest/ConnectionType/' + connectionType.id)
            .set('Authorization', adminToken)
            .send({
                ...connectionType,
                [nameField]: secondForwardName
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it('should not update an connection type to a duplicate name couple', function(done) {
        chai.request(server)
            .put('/rest/ConnectionType/' + connectionType.id)
            .set('Authorization', adminToken)
            .send({
                ...connectionType,
                [nameField]: forwardName,
                [reverseNameField]: reverseName,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                connectionType = res.body;
                done();
            });
    });

    it('should detect a difference between ids', function(done) {
        chai.request(server)
            .put('/rest/ConnectionType/' + connectionType.id + '3')
            .set('Authorization', adminToken)
            .send({
                ...connectionType,
                [nameField]: forwardName
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                connectionType = res.body;
                done();
            });
    });

    it('should not update a connection type as an editor', function(done) {
        chai.request(server)
            .put('/rest/ConnectionType/' + connectionType.id)
            .set('Authorization', editToken)
            .send({
                ...connectionType,
                [nameField]: 'Test name'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                connectionType = res.body;
                done();
            });
    });

    it('should create another connection type', function(done) {
        chai.request(server)
            .post('/rest/ConnectionType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Test Connection type',
                [reverseNameField]: 'Will be deleted'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                connectionType = res.body;
                done();
            });
    });

    it('should read the connection type', function(done) {
        chai.request(server)
            .get('/rest/ConnectionType/' + connectionType.id)
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body.id).to.be.equal(connectionType.id);
                expect(res.body.name).to.be.equal(connectionType.name);
                done();
            });
    });

    it('should not be able to delete the connection type as editor', function(done) {
        chai.request(server)
            .delete('/rest/ConnectionType/' + connectionType.id)
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should delete the connection type', function(done) {
        chai.request(server)
            .delete('/rest/ConnectionType/' + connectionType.id)
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it('should read all connection types and retrieve 2', function(done) {
        chai.request(server)
            .get('/rest/ConnectionTypes')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.equal(2);
                done();
            });
    });

});
