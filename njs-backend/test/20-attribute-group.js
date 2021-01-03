const { expect } = require('chai')
const { accountNameField, passphraseField, roleField, nameField } = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;

let chai = require('chai');
const { send } = require('process');

chai.use(chaihttp);


let adminToken, editToken, readerToken;
const hardwareAttributesName = 'Hardware attributes';
const networkAttributesName = 'Network attributes';

describe('Attribute groups', function() {
    before(function(done) {
        server = serverexp.default()
        chai.request(server)
            .post('/login')
            .send({
                [accountNameField]: 'testadmin',
                [passphraseField]: 'vms8XZYz!'
            })
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
            .send({
                [accountNameField]: 'testeditor',
                [passphraseField]: 'TestEdit1#'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                editToken = 'Bearer ' + res.body.token;
                done();
            });
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
            })
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
                expect(res.status).to.be.equal(422);
                done();
            })
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
            })
    });

    let attributeGroup;

    it('should create an attribute group', function(done) {
        chai.request(server)
            .post('/rest/AttributeGroup')
            .set('Authorization', adminToken)
            .send({
                [nameField]: networkAttributesName
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                attributeGroup = res.body;
                done();
            })
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
            })
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
                expect(res.status).to.be.equal(422);
                attributeGroup = res.body;
                done();
            })
    });

    it('should detect a difference between ids', function(done) {
        chai.request(server)
            .put('/rest/AttributeGroup/' + attributeGroup.id + '3')
            .set('Authorization', adminToken)
            .send({
                ...attributeGroup,
                [nameField]: hardwareAttributesName
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                attributeGroup = res.body;
                done();
            })
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
            })
    });

});
