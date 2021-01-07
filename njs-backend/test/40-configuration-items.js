const { expect } = require('chai')
const { nameField, attributeGroupsField, idField, attributeGroupIdField, typeIdField, responsibleUsersField } = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getAuthObject } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let editToken, readerToken;
let itemTypes, attributeTypes, item;

describe('Configuration items - basic tests', function() {
    before(function(done) {
        server = serverexp.default()
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
            .get('/rest/attributeTypes')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(2);
                attributeTypes = res.body;
                done();
            });
    });

    it('should create a configuration item', function(done) {
        chai.request(server)
            .post('/rest/configurationItem')
            .set('Authorization', editToken)
            .send({
                [nameField]: 'Test item',
                [typeIdField]: itemTypes[0][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                expect(res.body).to.have.property(nameField, 'Test item');
                expect(res.body).to.have.property(typeIdField, itemTypes[0][idField]);
                expect(res.body[responsibleUsersField]).to.be.a('array');
                expect(res.body[responsibleUsersField]).to.have.property('length', 1);
                expect(res.body[responsibleUsersField][0]).to.be.equal(getAuthObject(1).accountName.toLocaleLowerCase());
                item = res.body;
                done();
            });
    });

    it('should not be able to create a configuration item as reader', function(done) {
        chai.request(server)
            .post('/rest/configurationItem')
            .set('Authorization', readerToken)
            .send({
                [nameField]: 'Test item 2',
                [typeIdField]: itemTypes[0][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should not be able to create a duplicate configuration item', function(done) {
        chai.request(server)
            .post('/rest/configurationItem')
            .set('Authorization', editToken)
            .send({
                [nameField]: 'Test item',
                [typeIdField]: itemTypes[0][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should not be able to update a configuration item as reader', function(done) {
        chai.request(server)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', readerToken)
            .send({
                ...item,
                [nameField]: 'Blade enclosure 1',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should detect an update without changes', function(done) {
        chai.request(server)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(304);
                done();
            });
    });

    it('should not allow to change the item type in an update', function(done) {
        chai.request(server)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [typeIdField]: itemTypes[1][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should update a configuration item', function(done) {
        chai.request(server)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [nameField]: 'Blade enclosure 1',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property(nameField, 'Blade enclosure 1');
                expect(res.body).to.have.property(typeIdField, itemTypes[0][idField]);
                item = res.body;
                done();
            });
    });

});