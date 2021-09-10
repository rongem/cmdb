const { expect } = require('chai');
const {
    idField,
    typeIdField,
    nameField,
    descriptionField,
    upperItemIdField,
    lowerItemIdField,
    ruleIdField,
    connectionTypeIdField,
    responsibleUsersField,
    connectionsToUpperField,
    connectionsToLowerField,
    targetIdField,
    maxConnectionsToLowerField,
    maxConnectionsToUpperField,
    colorField,
} = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getToken, getAuthObject, validButNotExistingMongoId, notAMongoId } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken, readerToken;
let itemTypes, items0, items1, items2, rule0, rule2;
let itemsToConnect;

describe('Configuration items and connections', function() {
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
                rule0 = res.body[0];
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
                rule2 = res.body[0];
                done();
            });
    });

    it('should read all configuration items', function(done) {
        chai.request(server)
            .get('/rest/configurationitems/')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body.items).to.be.a('array');
                expect(res.body.items).to.have.property('length', res.body.totalItems);
                done();
            });
    });

    it('should read a full configuration item', function(done) {
        chai.request(server)
            .get('/rest/configurationitem/' + items1[0][idField] + '/full')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[colorField]).to.be.equal(items1[0][colorField]);
                expect(res.body[connectionsToUpperField]).to.be.a('array');
                expect(res.body[connectionsToUpperField]).to.have.property('length', 4);
                expect(res.body[connectionsToLowerField]).to.be.a('array');
                expect(res.body[connectionsToLowerField]).to.have.property('length', 0);
                done();
            });
    });

    it('should create a full configuration item with connections', function(done) {
        chai.request(server)
            .post('/rest/configurationItem/full')
            .set('Authorization', editToken)
            .send({
                [nameField]: 'Full server 1',
                [typeIdField]: itemTypes[2][idField],
                [connectionsToLowerField]: [{
                    [targetIdField]: items1[0][idField],
                    [ruleIdField]: rule2[idField],
                    [descriptionField]: 'xTest',
                }]
            })
            .end((err, res) => {
                if (res.status !== 201) {
                    console.log(res.status, res.body.data?.errors ?? res.body);
                }
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                expect(res.body).to.have.property(nameField, 'Full server 1');
                expect(res.body).to.have.property(typeIdField, itemTypes[2][idField]);
                expect(res.body[responsibleUsersField]).to.be.a('array');
                expect(res.body[responsibleUsersField]).to.have.property('length', 1);
                expect(res.body[responsibleUsersField][0]).to.be.equal(getAuthObject(1).accountName.toLocaleLowerCase());
                expect(res.body[connectionsToLowerField]).to.be.a('array');
                expect(res.body[connectionsToLowerField]).to.have.property('length', 1);
                expect(res.body[connectionsToLowerField][0]).to.have.property(descriptionField, 'xTest');
                items0.push(res.body);
                done();
            });
    });

    it('should read the full configuration item again and have one connection to upper more than before', function(done) {
        chai.request(server)
            .get('/rest/configurationitem/' + items1[0][idField] + '/full')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[connectionsToUpperField]).to.be.a('array');
                expect(res.body[connectionsToUpperField]).to.have.property('length', 5);
                expect(res.body[connectionsToLowerField]).to.be.a('array');
                expect(res.body[connectionsToLowerField]).to.have.property('length', 0);
                done();
            });
    });

    it('should find one less item as connectable for rule', function(done) {
        chai.request(server)
            .get('/rest/configurationitems/connectableasloweritem/rule/' + rule2[idField])
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 9);
                done();
        });
    });

    it('should find one less lower items as connectable for rule and item', function(done) {
        chai.request(server)
            .get('/rest/configurationitems/connectableasloweritem/item/' + items2[0][idField] + '/rule/' + rule2[idField])
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 9);
                done();
        });
    });

    it('should find one less lower items as connectable for rule and item', function(done) {
        chai.request(server)
            .get('/rest/configurationitems/connectableasloweritem/item/' + items2[0][idField] + '/rule/' + rule2[idField])
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 9);
                done();
        });
    });

    it('should detect a non existing item id', function(done) {
        chai.request(server)
            .get('/rest/configurationitems/connectableasloweritem/item/' + validButNotExistingMongoId + '/rule/' + rule2[idField])
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should get a validation error for an invalid item id', function(done) {
        chai.request(server)
            .get('/rest/configurationitems/connectableasloweritem/item/' + notAMongoId + '/rule/' + notAMongoId)
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                expect(res.body.data.errors).to.have.property('length', 2)
                done();
        });
    });

    it('should get one less items to connect one item to', function(done) {
        chai.request(server)
            .get('/rest/configurationitems/available/' + rule2[idField] + '/1')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 9);
                done();
        });
    });

    it('should get no items to connect more item to than allowed in the rule', function(done) {
        chai.request(server)
            .get('/rest/configurationitems/available/' + rule2[idField] + '/' + (rule2[maxConnectionsToUpperField] + 1))
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 0);
                done();
        });
    });

    it('should not find anything for a non existing rule id', function(done) {
        chai.request(server)
            .get('/rest/configurationitems/available/' + validButNotExistingMongoId + '/1')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should get a validation error for an invalid rule id and number', function(done) {
        chai.request(server)
            .get('/rest/configurationitems/available/' + notAMongoId + '/0')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                expect(res.body.data.errors).to.have.property('length', 2);
                done();
        });
    });

    it('should get items by id', function(done) {
        const itemIds = items0.map(i => i[idField]).join(',');
        chai.request(server)
            .get('/rest/configurationitems/' + itemIds)
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', items0.length);
                done();
        });
    });

    it('should get validation error with invalid item id', function(done) {
        const itemIds = [...items0.map(i => i[idField]), notAMongoId].join(',');
        chai.request(server)
            .get('/rest/configurationitems/' + itemIds)
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should get validation error with non existing item id', function(done) {
        const itemIds = [...items0.map(i => i[idField]), validButNotExistingMongoId].join(',');
        chai.request(server)
            .get('/rest/configurationitems/' + itemIds)
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should get items with connections by id', function(done) {
        const itemIds = items0.map(i => i[idField]).join(',');
        chai.request(server)
            .get('/rest/configurationitems/' + itemIds + '/full')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', items0.length);
                done();
        });
    });

    it('should get validation error with invalid item id', function(done) {
        const itemIds = [...items0.map(i => i[idField]), notAMongoId].join(',');
        chai.request(server)
            .get('/rest/configurationitems/' + itemIds + '/full')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should get validation error with non existing item id', function(done) {
        const itemIds = [...items0.map(i => i[idField]), validButNotExistingMongoId].join(',');
        chai.request(server)
            .get('/rest/configurationitems/' + itemIds + '/full')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

});
