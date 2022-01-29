const { expect } = require('chai');
const { nameField, idField } = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getToken, validButNotExistingMongoId, notAMongoId } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken;
const hardwareAttributesName = 'Hardware attributes';
const networkAttributesName = 'Network attributes';

describe('Attribute groups', function() {
    before(function() {
        adminToken = getToken('admin');
        editToken = getToken('editor');
        server = serverexp.default()
    });

    it('should create an attribute group', function(done) {
        chai.request(server)
            .post('/rest/AttributeGroup')
            .set('Authorization', adminToken)
            .send({
                [nameField]: hardwareAttributesName
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                expect(res.body).to.have.property(nameField, hardwareAttributesName);
                done();
            });
    });

    it('should not create an attribute group of the same name', function(done) {
        chai.request(server)
            .post('/rest/AttributeGroup')
            .set('Authorization', adminToken)
            .send({
                [nameField]: hardwareAttributesName
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                done();
            });
    });

    it('should not be allowed to create an attribute group as editor', function(done) {
        chai.request(server)
            .post('/rest/AttributeGroup')
            .set('Authorization', editToken)
            .send({
                [nameField]: networkAttributesName
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    let attributeGroup;

    it('should create an attribute group', function(done) {
        chai.request(server)
            .post('/rest/AttributeGroup')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Attribute Group 2'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                attributeGroup = res.body;
                done();
            });
    });

    it('should detect an update with no changes', function(done) {
        chai.request(server)
            .put('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', adminToken)
            .send({
                ...attributeGroup,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(304);
                done();
            });
    });

    it('should update an attribute group', function(done) {
        chai.request(server)
            .put('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', adminToken)
            .send({
                ...attributeGroup,
                [nameField]: networkAttributesName
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it('should not update an attribute group to a duplicate name', function(done) {
        chai.request(server)
            .put('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', adminToken)
            .send({
                ...attributeGroup,
                [nameField]: hardwareAttributesName
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                attributeGroup = res.body;
                done();
            });
    });

    it('should detect a difference between ids', function(done) {
        chai.request(server)
            .put('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', adminToken)
            .send({
                ...attributeGroup,
                [idField]: validButNotExistingMongoId,
                [nameField]: hardwareAttributesName
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                attributeGroup = res.body;
                done();
            });
    });

    it('should not update an attribute group as an editor', function(done) {
        chai.request(server)
            .put('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', editToken)
            .send({
                ...attributeGroup,
                [nameField]: 'Test name'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                attributeGroup = res.body;
                done();
            });
    });

    it('should create another attribute group', function(done) {
        chai.request(server)
            .post('/rest/AttributeGroup')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Test Attribute group'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                attributeGroup = res.body;
                done();
            });
    });

    it('should read the attribute group', function(done) {
        chai.request(server)
            .get('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body.id).to.be.equal(attributeGroup.id);
                expect(res.body.name).to.be.equal(attributeGroup.name);
                done();
            });
    });

    it('should get an error reading a non existing attribute group', function(done) {
        chai.request(server)
            .get('/rest/AttributeGroup/' + validButNotExistingMongoId)
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(404);
                done();
            });
    });

    it('should get a validation error reading an attribute group with an invalid id', function(done) {
        chai.request(server)
            .get('/rest/AttributeGroup/' + notAMongoId)
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                done();
            });
    });

    it('should not be able to delete the attribute group as editor', function(done) {
        chai.request(server)
            .delete('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should delete the attribute group', function(done) {
        chai.request(server)
            .delete('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it('should create another attribute group', function(done) {
        chai.request(server)
            .post('/rest/AttributeGroup')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Status attributes'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                attributeGroup = res.body;
                done();
            });
    });

    it('should create another attribute group', function(done) {
        chai.request(server)
            .post('/rest/AttributeGroup')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Server attributes'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                attributeGroup = res.body;
                done();
            });
    });

    it('should mark attribute group without attribute types as deletable', function(done) {
        chai.request(server)
            .get('/rest/attributegroup/' + attributeGroup[idField] + '/candelete')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.equal(true);
                done();
            });
    });

    it('should read all attribute groups and retrieve 4 in a sorted order', function(done) {
        chai.request(server)
            .get('/rest/AttributeGroups')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.equal(4);
                expect(res.body[0][nameField] < res.body[1][nameField]).to.be.true;
                expect(res.body[1][nameField] < res.body[2][nameField]).to.be.true;
                expect(res.body[2][nameField] < res.body[3][nameField]).to.be.true;
                done();
            });
    });

});
