const { expect } = require('chai')
const {
    idField,
    itemTypeIdField,
    nameOrValueField,
    changedBeforeField,
    changedAfterField,
    attributesField,
    typeIdField,
    valueField,
    responsibleUserField,
    accountNameField,
    connectionsToLowerField,
    connectionsToUpperField,
    lowerItemTypeIdField,
    connectionTypeIdField,
    countField,
    upperItemTypeIdField,
    maxLevelsField,
    searchDirectionField,
} = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getToken, getAuthObject, validButNotExistingMongoId, notAMongoId } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let readerToken;
let itemTypes, attributeTypes, rule2, items;

describe('Search configuration items', function() {
    before(function() {
        // adminToken = getToken('admin');
        readerToken = getToken('reader');
        // editToken = getToken('editor');
        server = serverexp.default()
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/itemtypes')
            .set('Authorization', readerToken)
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
            .get('/rest/attributetypes')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(2);
                attributeTypes = res.body;
                done();
            });
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/connectiontypes')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(1);
                connectionTypes = res.body;
                done();
            });
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/connectionrules/forupperitemtype/' + itemTypes[2][idField])
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property('length', 1);
                rule2 = res.body[0];
                done();
            });
    });

    it('should not search with no criteria', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should search and find items by item type', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: itemTypes[0][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(1);
                done();
            });
    });

    it('should search and find items by item type and date', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [changedAfterField]: new Date(Date.now() - 15000),
                [changedBeforeField]: new Date(Date.now()),
                [itemTypeIdField]: itemTypes[0][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(0);
                done();
            });
    });

    it('should get a validation error when after date is before date', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [changedAfterField]: new Date(Date.now()),
                [changedBeforeField]: new Date(Date.now() - 15000),
                [itemTypeIdField]: itemTypes[0][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should get a validation error when a date is invalid', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [changedAfterField]: 'blo',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should search and find items by name or attribute value', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [nameOrValueField]: 'Blade',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(0);
                done();
            });
    });

    it('should get a validation error with non-array as attributes value', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [attributesField]: 'Blade',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should search and find items by non existing attribute value of type', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [attributesField]: [
                    { [typeIdField]: attributeTypes[0][idField] },
                ],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(10);
                done();
            });
    });

    it('should search and find items by attribute value of type', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [attributesField]: [
                    {
                        [typeIdField]: attributeTypes[1][idField],
                        [valueField]: 'IP val'
                    },
                ],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.equal(1);
                done();
            });
    });

    it('should search and find items by not empty attribute value of type', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [attributesField]: [
                    {
                        [typeIdField]: attributeTypes[1][idField],
                        [valueField]: '!'
                    },
                ],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.equal(1);
                done();
            });
    });

    it('should search and find items by not equal attribute value of type', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [attributesField]: [
                    {
                        [typeIdField]: attributeTypes[1][idField],
                        [valueField]: '!ip'
                    },
                ],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.equal(0);
                done();
            });
    });

    it('should get a validation error for an invalid attribute type', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [attributesField]: [
                    { [typeIdField]: validButNotExistingMongoId },
                ],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should get a validation error for an invalid attribute type', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [attributesField]: [
                    { [typeIdField]: notAMongoId },
                ],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should search and find items by responsible user', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [responsibleUserField]: getAuthObject(2)[accountNameField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.equal(1);
                done();
            });
    });

    it('should search and find 0 items by invalid responsible user', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [responsibleUserField]: 'invalidUser',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.equal(0);
                done();
            });
    });

    it('should find items with connections', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: rule2[lowerItemTypeIdField],
                [connectionsToUpperField]: [{
                    [connectionTypeIdField]: rule2[connectionTypeIdField],
                    [countField]: '1+',
                }],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(0);
                items = res.body;
                done();
            });
    });

    it('should find items with connections and upper item type', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: rule2[lowerItemTypeIdField],
                [connectionsToUpperField]: [{
                    [connectionTypeIdField]: rule2[connectionTypeIdField],
                    [itemTypeIdField]: rule2[upperItemTypeIdField],
                    [countField]: '1+',
                }],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                done();
            });
    });

    it('should get a validation error for a not existing item type id', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: rule2[lowerItemTypeIdField],
                [connectionsToUpperField]: [{
                    [connectionTypeIdField]: validButNotExistingMongoId,
                    [itemTypeIdField]: validButNotExistingMongoId,
                    [countField]: '1+',
                }],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                expect(res.body.data.errors).to.be.a('array');
                expect(res.body.data.errors.length).to.be.equal(2);
                done();
            });
    });

    it('should get a validation error for an invalid item type id', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: rule2[lowerItemTypeIdField],
                [connectionsToUpperField]: [{
                    [connectionTypeIdField]: notAMongoId,
                    [itemTypeIdField]: notAMongoId,
                    [countField]: '1+',
                }],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                expect(res.body.data.errors).to.be.a('array');
                expect(res.body.data.errors.length).to.be.equal(2);
                done();
            });
    });

    it('should get an error for invalid connection arrays and missing search criteria and item type', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [connectionsToLowerField]: 'invalidArray',
                [connectionsToUpperField]: 'invalidArray',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                expect(res.body.data.errors).to.be.a('array');
                expect(res.body.data.errors.length).to.be.equal(4);
                done();
            });
    });

    it('should search and find full items by item type', function(done) {
        chai.request(server)
            .search('/rest/configurationitems/full')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: itemTypes[2][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                const itemsWithConnections = res.body.filter(item => item[connectionsToLowerField].length > 0 || item[connectionsToUpperField].length > 0);
                expect(res.body).to.be.a('array');
                expect(itemsWithConnections.length).to.be.greaterThan(4);
                done();
            });
    });

});

describe('Search config items neighbors', function() {
    it('should do nothing but send a 200 at the moment', function(done) {
        chai.request(server)
            .search('/rest/configurationitem/' + items[0][idField])
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: itemTypes[2][idField],
                [maxLevelsField]: 1,
                [searchDirectionField]: 'up'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                if (res.status !== 200) {
                    console.log(res.body.data ?? res.body);
                }
                expect(res.status).to.be.equal(200);
                console.log(items[0]);
                console.log(res.body);
                done();
            });
    });
})
