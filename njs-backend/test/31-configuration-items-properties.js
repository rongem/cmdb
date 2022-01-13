const { expect } = require('chai');
const { nameField,
    idField,
    typeIdField,
    linksField,
    uriField,
    descriptionField,
    attributesField,
    valueField,
    connectionsToLowerField,
    connectionsToUpperField,
    attributeGroupsField,
    attributeGroupField,
    attributeGroupIdField,
} = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getToken, getAllowedAttributeTypes, getDisallowedAttributeTypes, notAMongoId, validButNotExistingMongoId } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken, readerToken;
let itemTypes, attributeTypes, item, attributeGroups;
const be1 = 'Blade Enclosure 1';
let allowedAttributes, disallowedAttributes;
const array = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

describe('Configuration items - attributes', function() {
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
            .get('/rest/attributeTypes')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(2);
                attributeTypes = res.body;
                allowedAttributes = getAllowedAttributeTypes(itemTypes[2], attributeTypes);
                disallowedAttributes = getDisallowedAttributeTypes(itemTypes[2], attributeTypes);
                done();
            });
    });


    it('should create a configuration item with all allowed attributes', function(done) {
        chai.request(server)
            .post('/rest/configurationItem')
            .set('Authorization', editToken)
            .send({
                [nameField]: 'Rack server 1',
                [typeIdField]: itemTypes[2][idField],
                [attributesField]: allowedAttributes.map(a => ({
                    [typeIdField]: a[idField],
                    [valueField]: 'my value',
                })),
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                expect(res.body[attributesField]).to.be.a('array');
                expect(res.body[attributesField]).to.have.property('length', allowedAttributes.length);
                item = res.body;
                done();
            });
    });

    it('should count 1 attribute for the allowed attribute type', function(done) {
        chai.request(server)
            .get('/rest/attributetype/' + allowedAttributes[0][idField] + '/attributes/count')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.equal(1);
                done();
            });
    });

    it('should count 0 attributes for the non allowed attribute type', function(done) {
        chai.request(server)
            .get('/rest/attributetype/' + disallowedAttributes[0][idField] + '/attributes/count')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.equal(0);
                done();
            });
    });

    it('should get an error for a non existing attribute type id', function(done) {
        chai.request(server)
            .get('/rest/attributetype/' + validButNotExistingMongoId + '/attributes/count')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(404);
                done();
            });
    });

    it('should get a validation error for an invalid attribute type id', function(done) {
        chai.request(server)
            .get('/rest/attributetype/' + notAMongoId + '/attributes/count')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                done();
            });
    });

    it('should not create a configuration item with any disallowed attributes', function(done) {
        chai.request(server)
            .post('/rest/configurationItem')
            .set('Authorization', editToken)
            .send({
                [nameField]: 'Rack server 2',
                [typeIdField]: itemTypes[2][idField],
                [attributesField]: disallowedAttributes.map(a => ({
                    [typeIdField]: a[idField],
                    [valueField]: 'my value',
                })),
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                expect(res.body.data.errors).to.be.a('array');
                expect(res.body.data.errors).to.have.property('length', disallowedAttributes.length);
                done();
            });
    });

    it('should not create a configuration item with duplicate attribute types', function(done) {
        chai.request(server)
            .post('/rest/configurationItem')
            .set('Authorization', editToken)
            .send({
                [nameField]: 'Rack server 2',
                [typeIdField]: itemTypes[2][idField],
                [attributesField]: [{
                        [typeIdField]: allowedAttributes[0][idField],
                        [valueField]: 'my value',
                    }, {
                        [typeIdField]: allowedAttributes[0][idField],
                        [valueField]: 'my value 2',
                }]
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                done();
            });
    });

    it('should not update a configuration item with a disallowed attribute', function(done) {
        chai.request(server)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [attributesField]: [...item[attributesField], {
                    [typeIdField]: disallowedAttributes[0][idField],
                    [valueField]: 'my value'
                }]
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                done();
            });
    });

    it('should not update a configuration item with a duplicate attribute', function(done) {
        chai.request(server)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [attributesField]: [...item[attributesField], {
                    ...item[attributesField][0],
                    [idField]: undefined,
                    [valueField]: 'my value 2'
                }]
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                done();
            });
    });

    it('should update a configuration item with a removed attribute', function(done) {
        chai.request(server)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [attributesField]: item[attributesField].filter((a, i) => i !== 0)
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[attributesField]).to.have.property('length', allowedAttributes.length - 1);
                item = res.body;
                done();
            });
    });

    it('should update a configuration item with another removed attribute and added an allowed one', function(done) {
        chai.request(server)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [attributesField]: [...item[attributesField].filter((a, i) => i !== 0), {
                    [typeIdField]: allowedAttributes[0][idField],
                    [valueField]: 'ip value'
                }]
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[attributesField]).to.have.property('length', allowedAttributes.length - 1);
                item = res.body;
                done();
            });
    });

    it('should remove an attribute group from the item type', function(done) {
        attributeGroups = itemTypes[2][attributeGroupsField];
        chai.request(server)
            .put('/rest/itemtype/' + itemTypes[2][idField])
            .set('Authorization', adminToken)
            .send({
                ...itemTypes[2],
                [attributeGroupsField]: itemTypes[2][attributeGroupsField].filter(ag => ag[idField] !== allowedAttributes[0][attributeGroupIdField]),
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                itemTypes[2] = res.body;
                done();
            });
    });

    it('should read an item where the attribute from before is removed', function(done) {
        chai.request(server)
            .get('/rest/configurationitem/' + item[idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[attributesField]).to.have.property('length', allowedAttributes.length - 2);
                item = res.body;
                done();
            });
    });

    after(function(done) {
        chai.request(server)
            .put('/rest/itemtype/' + itemTypes[2][idField])
            .set('Authorization', adminToken)
            .send({
                ...itemTypes[2],
                [attributeGroupsField]: attributeGroups,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                itemTypes[2] = res.body;
                done();
            });
    });

    after(function(done) {
        chai.request(server)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [attributesField]: [...item[attributesField], {
                    [typeIdField]: allowedAttributes[0][idField],
                    [valueField]: 'ip value'
                }]
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[attributesField]).to.have.property('length', allowedAttributes.length - 1);
                item = res.body;
                done();
            });
    });
});

describe('Configuration items - links', function() {
    it('should update the item with two links to external sites', function(done) {
        chai.request(server)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [linksField]: [
                    { [uriField]: 'https://nodejs.org', [descriptionField]: 'Node JS' },
                    { [uriField]: 'https://angular.io', [descriptionField]: 'Angular' },
                ]
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[linksField]).to.have.property('length', 2);
                item = res.body;
                done();
            });
    });

    it('should not update the item with illegal links', function(done) {
        chai.request(server)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [linksField]: [
                    ...item[linksField],
                    { [uriField]: 'file://myserver/test', [descriptionField]: 'File server' },
                    { [uriField]: 'https://angular.io' },
                    { [descriptionField]: 'File server' },
                ]
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                expect(res.body.data.errors).to.be.a('array');
                expect(res.body.data.errors).to.have.property('length', 4);
                done();
            });
    });

    it('should update the item while removing a link', function(done) {
        chai.request(server)
            .put('/rest/configurationItem/' + item[idField])
            .set('Authorization', editToken)
            .send({
                ...item,
                [linksField]: [item[linksField][1]]
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[linksField]).to.be.a('array');
                expect(res.body[linksField][0]).to.have.property(uriField, item[linksField][1][uriField]);
                item = res.body;
                done();
            });
    });

    it('should read the item', function(done) {
        chai.request(server)
            .get('/rest/configurationItem/' + item[idField])
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it('should read the full item (i.e. with connections)', function(done) {
        chai.request(server)
            .get('/rest/configurationItem/' + item[idField] + '/full')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[connectionsToLowerField]).to.be.a('array');
                expect(res.body[connectionsToUpperField]).to.be.a('array');
                done();
            });
    });

    it('should mark an attribute type with active attributes as not deletable', function(done) {
        chai.request(server)
            .get('/rest/attributetype/' + item[attributesField][0][typeIdField] + '/candelete')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.equal(false);
                done();
            });
    });

    it('should not delete an attriubute type with active attributes', function(done) {
        chai.request(server)
            .delete('/rest/attributetype/' + item[attributesField][0][typeIdField])
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                done();
            });
    })

});

describe('Item types and configuration items', function() {

    it('should mark an item type without items and rules as deletable', function(done) {
        chai.request(server)
            .get('/rest/itemType/' + itemTypes[itemTypes.length - 1][idField] + '/candelete')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.equal(true);
                done();
            });
    });

    it('should create an item for the singleton type', function(done) {
        chai.request(server)
            .post('/rest/configurationItem')
            .set('Authorization', editToken)
            .send({
                [nameField]: 'Singleton 1',
                [typeIdField]: itemTypes[itemTypes.length - 1][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                item = res.body;
                done();
            });
    });

    it('should mark an item type with items as not deletable', function(done) {
        chai.request(server)
            .get('/rest/itemType/' + itemTypes[itemTypes.length - 1][idField] + '/candelete')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.equal(false);
                done();
            });
    });

    it('should not be able to delete an item type with active items', function(done) {
        chai.request(server)
            .delete('/rest/itemtype/' + item[typeIdField])
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
                done();
            });
    });

    if ('should get a proposal for an attribute value', function(done) {
        chai.request(server)
            .delete('/rest/proposals/my+v')
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(0);
                expect(res.body[0]).to.be.a('string');
                expect(res.body).to.include('my value');
                done();
            });
    });

    array.forEach(function(i) {
        createItem(i, 0);
        createItem(i, 1);
        createItem(i, 2);
    })

});

function createItem(i, itemType) {
    after(function(done) {
        console.log('  - Creating item ' + itemTypes[itemType][nameField] + ' ' + i.toString());
        chai.request(server)
            .post('/rest/configurationItem')
            .set('Authorization', editToken)
            .send({
                [nameField]: itemTypes[itemType][nameField] + ' ' + i.toString(),
                [typeIdField]: itemTypes[itemType][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                done();
            });
    });
};
