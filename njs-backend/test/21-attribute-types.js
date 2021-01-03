const { expect } = require('chai')
const {
    nameField,
    attributeGroupIdField,
    idField,
    validationExpressionField
} = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getAuthObject } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken, readerToken;
let attributeGroups;
let attributeType;
const ipAddressName = 'IP address';

function testSuccessfulCreatingAttribute(done, name, group, validationExpression = '^.*$') {
    chai.request(server)
        .post('/rest/attributetype')
        .set('Authorization', adminToken)
        .send({
            [nameField]: name,
            [attributeGroupIdField]: group,
            [validationExpressionField]: validationExpression,
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(201);
            expect(res.body).to.have.property(nameField, name);
            expect(res.body).to.have.property(attributeGroupIdField, group);
            expect(res.body).to.have.property(validationExpressionField, validationExpression);
            attributeType = res.body;
            done();
    });
}

describe('Attribute types', function() {
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
            .get('/rest/AttributeGroups')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                attributeGroups = res.body;
                done();
            });
    });

    it('should create an ip address attribute type', function(done) {
        testSuccessfulCreatingAttribute(done, ipAddressName, attributeGroups[1][idField]);
    });

    it('should not create a second ip address attribute type', function(done) {
        chai.request(server)
            .post('/rest/attributetype')
            .set('Authorization', adminToken)
            .send({
                [nameField]: ipAddressName,
                [attributeGroupIdField]: attributeGroups[1][idField],
                [validationExpressionField]: '^.*$',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should not create an attribute type with an invalid attribute group', function(done) {
        chai.request(server)
            .post('/rest/attributetype')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'test',
                [attributeGroupIdField]: attributeGroups[1][idField] + '3',
                [validationExpressionField]: '^.*$',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should not create an attribute type with an invalid regex', function(done) {
        chai.request(server)
            .post('/rest/attributetype')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'test',
                [attributeGroupIdField]: attributeGroups[1][idField],
                [validationExpressionField]: 'xx',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should not create an attribute type as editor', function(done) {
        chai.request(server)
            .post('/rest/attributetype')
            .set('Authorization', editToken)
            .send({
                [nameField]: 'test',
                [attributeGroupIdField]: attributeGroups[1][idField],
                [validationExpressionField]: '^.*$',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should create a serial attribute', function(done) {
        testSuccessfulCreatingAttribute(done, 'Serial', attributeGroups[1][idField]);
    });

    it('should not update an attribute type as editor', function(done) {
        chai.request(server)
            .put('/rest/attributetype/' + attributeType[idField])
            .set('Authorization', editToken)
            .send({
                ...attributeType,
                [nameField]: 'Serial number',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should not update an attribute type to a duplicate name', function(done) {
        chai.request(server)
            .put('/rest/attributetype/' + attributeType[idField])
            .set('Authorization', adminToken)
            .send({
                ...attributeType,
                [nameField]: ipAddressName,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should detect an update with no changes', function(done) {
        chai.request(server)
            .put('/rest/attributetype/' + attributeType[idField])
            .set('Authorization', adminToken)
            .send({
                ...attributeType,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(304);
                done();
            });
    });

    it('should update an attribute type', function(done) {
        chai.request(server)
            .put('/rest/attributetype/' + attributeType[idField])
            .set('Authorization', adminToken)
            .send({
                ...attributeType,
                [nameField]: 'Serial number',
                [attributeGroupIdField]: attributeGroups[0][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property(nameField, 'Serial number');
                expect(res.body).to.have.property(attributeGroupIdField, attributeGroups[0][idField]);
                done();
            });
    });

    it('should create a manufacturer attribute', function(done) {
        testSuccessfulCreatingAttribute(done, 'Manufacturer', attributeGroups[0][idField]);
    });

    it('should create a model attribute', function(done) {
        testSuccessfulCreatingAttribute(done, 'Model', attributeGroups[0][idField]);
    });

    it('should create a waste attribute', function(done) {
        testSuccessfulCreatingAttribute(done, 'Waste', attributeGroups[0][idField]);
    });

    it('should not be allowed to delete an attribute type as editor', function(done) {
        chai.request(server)
            .delete('/rest/attributetype/' + attributeType[idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should delete an attribute type', function(done) {
        chai.request(server)
            .delete('/rest/attributetype/' + attributeType[idField])
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                done();
            });
    });

});