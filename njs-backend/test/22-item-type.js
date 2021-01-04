const { expect } = require('chai')
const { nameField, colorField, attributeGroupsField, idField } = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getAuthObject } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken, readerToken;
let attributeGroups;
const rackServerName = 'Rack server hardware';
const rackName = 'Rack';
const color = '#FFFFFF';

describe('Item types', function() {
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

    it('should create an item type', function(done) {
        chai.request(server)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: rackServerName,
                [colorField]: color,
                [attributeGroupsField]: attributeGroups
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                expect(res.body).to.have.property(nameField, rackServerName);
                expect(res.body).to.have.property(colorField, color);
                expect(res.body[attributeGroupsField]).to.be.a('array');
                expect(res.body[attributeGroupsField]).to.have.property('length', attributeGroups.length);
                done();
            });
    });

    it('should not create an item type of the same name', function(done) {
        chai.request(server)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: rackServerName,
                [colorField]: color
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should not create an item type without a color', function(done) {
        chai.request(server)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Test item type',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should not create an item type without a wrong color', function(done) {
        chai.request(server)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Test item type',
                [colorField]:'black'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should not create an item type with wrong attribute groups', function(done) {
        chai.request(server)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Test item type',
                [colorField]: color,
                [attributeGroupsField]: ['test']
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should not be allowed to create an item type as editor', function(done) {
        chai.request(server)
            .post('/rest/ItemType')
            .set('Authorization', editToken)
            .send({
                [nameField]: rackName,
                [colorField]: color
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    let itemType;

    it('should create an item type', function(done) {
        chai.request(server)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Item Type 2',
                [colorField]: color,
                [attributeGroupsField]: [attributeGroups[1]]
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                expect(res.body[attributeGroupsField].length).to.be.equal(1);
                itemType = res.body;
                done();
            });
    });

    it('should detect an update with no changes', function(done) {
        chai.request(server)
            .put('/rest/ItemType/' + itemType.id)
            .set('Authorization', adminToken)
            .send({
                ...itemType,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(304);
                done();
            });
    });

    it('should update an item type', function(done) {
        chai.request(server)
            .put('/rest/ItemType/' + itemType.id)
            .set('Authorization', adminToken)
            .send({
                ...itemType,
                [nameField]: rackName,
                [attributeGroupsField]: [attributeGroups[0]]
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[attributeGroupsField].length).to.be.equal(1);
                expect(res.body[attributeGroupsField][0][idField]).to.be.equal(attributeGroups[0][idField]);
                done();
            });
    });

    it('should not update an item type to a duplicate name', function(done) {
        chai.request(server)
            .put('/rest/ItemType/' + itemType.id)
            .set('Authorization', adminToken)
            .send({
                ...itemType,
                [nameField]: rackServerName
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                itemType = res.body;
                done();
            });
    });

    it('should detect a difference between ids', function(done) {
        chai.request(server)
            .put('/rest/ItemType/' + itemType.id + '3')
            .set('Authorization', adminToken)
            .send({
                ...itemType,
                [nameField]: rackServerName
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                itemType = res.body;
                done();
            });
    });

    it('should not update an item type as an editor', function(done) {
        chai.request(server)
            .put('/rest/ItemType/' + itemType.id)
            .set('Authorization', editToken)
            .send({
                ...itemType,
                [nameField]: 'Test name'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                itemType = res.body;
                done();
            });
    });

    it('should create another item type', function(done) {
        chai.request(server)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Test Item type',
                [colorField]: color,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                itemType = res.body;
                done();
            });
    });

    it('should read the item type', function(done) {
        chai.request(server)
            .get('/rest/ItemType/' + itemType.id)
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body.id).to.be.equal(itemType.id);
                expect(res.body.name).to.be.equal(itemType.name);
                done();
            });
    });

    it('should not be able to delete the item type as editor', function(done) {
        chai.request(server)
            .delete('/rest/ItemType/' + itemType.id)
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should delete the item type', function(done) {
        chai.request(server)
            .delete('/rest/ItemType/' + itemType.id)
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    let itemTypes;

    it('should read all item types and retrieve 2', function(done) {
        chai.request(server)
            .get('/rest/ItemTypes')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.equal(2);
                itemTypes = res.body;
                done();
            });
    });

    it('should retrieve 4 attribute types for the first item type', function(done) {
        chai.request(server)
            .get('/rest/attributetypes/foritemtype/' + itemTypes[0][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.equal(4);
                done();
            });
    });

    it('should retrieve 3 attribute types for the second item type', function(done) {
        chai.request(server)
            .get('/rest/attributetypes/foritemtype/' + itemTypes[1][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.equal(3);
                done();
            });
    });
});
