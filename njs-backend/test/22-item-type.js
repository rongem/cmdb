const { expect } = require('chai');
const { nameField,
    colorField,
    attributeGroupsField,
    idField,
    itemTypeIdField,
    attributeGroupIdField,
} = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getToken, validButNotExistingMongoId, notAMongoId } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken;
let attributeGroups;
let attributeTypes;
const rackServerName = 'Rack server hardware';
const rackName = 'Rack';
const bladeEnclosureName = 'Blade enclosure';
const color = '#FFFFFF';

describe('Item types', function() {
    before(function() {
        adminToken = getToken('admin');
        editToken = getToken('editor');
        server = serverexp.default()
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/AttributeGroups')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(3);
                attributeGroups = res.body;
                done();
            });
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/AttributeTypes')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(3);
                attributeTypes = res.body;
                done();
            });
    });

    it('should not find item types for an attribute type yet', function(done) {
        chai.request(server)
            .get('/rest/itemtypes/byallowedattributetype/' + attributeTypes[0][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 0);
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
                [attributeGroupsField]: [attributeGroups[0], attributeGroups[1], attributeGroups[3]]
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                expect(res.body).to.have.property(nameField, rackServerName);
                expect(res.body).to.have.property(colorField, color);
                expect(res.body[attributeGroupsField]).to.be.a('array');
                expect(res.body[attributeGroupsField]).to.have.property('length', 3);
                done();
            });
    });

    it('should find item types for an attribute type', function(done) {
        chai.request(server)
            .get('/rest/itemtypes/byallowedattributetype/' + attributeTypes.filter(at => at[attributeGroupIdField] === attributeGroups[0][idField])[0][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 1);
                done();
            });
    });

    it('should not find item types for a not existing attribute type', function(done) {
        chai.request(server)
            .get('/rest/itemtypes/byallowedattributetype/' + validButNotExistingMongoId)
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(404);
                done();
            });
    });

    it('should get a validation error searching item types for an invalid attribute type id', function(done) {
        chai.request(server)
            .get('/rest/itemtypes/byallowedattributetype/' + notAMongoId)
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
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

    it('should not create an item type with duplicate attribute groups', function(done) {
        chai.request(server)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Test item type',
                [colorField]: color,
                [attributeGroupsField]: [attributeGroups[1], attributeGroups[1]]
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

    it('should create another item type', function(done) {
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

    it('should retrieve 1 attribute group in this item type', function(done) {
        chai.request(server)
            .get('/rest/attributegroups/initemtype/' + itemType[idField])
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 1);
                expect(res.body[0][idField]).to.be.equal(attributeGroups[1][idField])
                done();
            });
    });

    it('should retrieve 3 attribute groups not in this item type', function(done) {
        chai.request(server)
            .get('/rest/attributegroups/notinitemtype/' + itemType[idField])
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 3);
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
                itemType = res.body;
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
            .put('/rest/ItemType/' + itemType.id)
            .set('Authorization', adminToken)
            .send({
                ...itemType,
                [idField]: validButNotExistingMongoId,
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

    it('should not get a non existing item type', function(done) {
        chai.request(server)
            .get('/rest/ItemType/' + validButNotExistingMongoId)
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(404);
                done();
            });
    });

    it('should get a validation error reading an item type with an invalid id', function(done) {
        chai.request(server)
            .get('/rest/ItemType/' + notAMongoId)
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
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

    it('should retrieve 3 attribute types for the first item type', function(done) {
        chai.request(server)
            .get('/rest/attributetypes/foritemtype/' + itemTypes[0][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.equal(3);
                done();
            });
    });

    it('should retrieve 5 attribute types for the second item type', function(done) {
        chai.request(server)
            .get('/rest/attributetypes/foritemtype/' + itemTypes[1][idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.equal(5);
                expect(res.body[0][nameField] < res.body[1][nameField]).to.be.true;
                expect(res.body[1][nameField] < res.body[2][nameField]).to.be.true;
                expect(res.body[2][nameField] < res.body[3][nameField]).to.be.true;
                expect(res.body[3][nameField] < res.body[4][nameField]).to.be.true;
                done();
            });
    });

    it('should create another item type', function(done) {
        chai.request(server)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: bladeEnclosureName,
                [colorField]: color,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                itemType = res.body;
                done();
            });
    });

    it('should mark an item type without items and rules as deletable', function(done) {
        chai.request(server)
            .get('/rest/itemType/' + itemType[idField] + '/candelete')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.equal(true);
                done();
            });
    });

    it('should read all item types and retrieve 3 in a sorted order', function(done) {
        chai.request(server)
            .get('/rest/ItemTypes')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.equal(3);
                expect(res.body[0][nameField] < res.body[1][nameField]).to.be.true;
                expect(res.body[1][nameField] < res.body[2][nameField]).to.be.true;
                done();
            });
    });

    it('should not be able to create a new mapping as editor', function(done){
        chai.request(server)
            .post('/rest/mapping')
            .set('Authorization', editToken)
            .send({
                [itemTypeIdField]: itemType[idField],
                [attributeGroupIdField]: attributeGroups[0][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should create a new mapping', function(done){
        chai.request(server)
            .post('/rest/mapping')
            .set('Authorization', adminToken)
            .send({
                [itemTypeIdField]: itemType[idField],
                [attributeGroupIdField]: attributeGroups[0][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[itemTypeIdField]).to.be.equal(itemType[idField]),
                expect(res.body[attributeGroupIdField]).to.be.equal(attributeGroups[0][idField]),
                done();
            });
    });

    it('should not create a duplicate mapping', function(done){
        chai.request(server)
            .post('/rest/mapping')
            .set('Authorization', adminToken)
            .send({
                [itemTypeIdField]: itemType,
                [attributeGroupIdField]: attributeGroups[0],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should not be able to delete a mapping as editor', function(done){
        chai.request(server)
            .delete('/rest/mapping/group/' + attributeGroups[0][idField] + '/itemtype/' + itemType[idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should delete a mapping', function(done){
        chai.request(server)
            .delete('/rest/mapping/group/' + attributeGroups[0][idField] + '/itemtype/' + itemType[idField])
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it('should show all mappings', function(done) {
        chai.request(server)
            .get('/rest/mappings')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(3);
                done();
            });
    })

    // should create a singleton item type
    after(function(done) {
        chai.request(server)
            .post('/rest/ItemType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'ZZZ-Singleton',
                [colorField]: color,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                done();
            });
    });

});
