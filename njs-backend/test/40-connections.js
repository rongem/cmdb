const { expect } = require('chai');
const {
    idField,
    typeIdField,
    descriptionField,
    upperItemIdField,
    lowerItemIdField,
    ruleIdField,
    connectionTypeIdField,
    responsibleUsersField,
    validationExpressionField,
    maxConnectionsToUpperField,
} = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getToken, getAuthObject, validButNotExistingMongoId, notAMongoId } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken, readerToken;
let itemTypes, items0, items1, items2, rules0, rules2;
let conn;

describe('Connections', function() {
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
                rules0 = res.body[0];
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
                rules2 = res.body[0];
                done();
            });
    });

    it('should find all created items as connectable for rule', function(done) {
        chai.request(server)
            .get('/rest/configurationitems/connectableasloweritem/rule/' + rules2[idField])
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 10);
                done();
        });
    });

    it('should not find items when using a not existing rule id', function(done) {
        chai.request(server)
            .get('/rest/configurationitems/connectableasloweritem/rule/' + validButNotExistingMongoId)
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should get a validation error when using an invalid rule id', function(done) {
        chai.request(server)
            .get('/rest/configurationitems/connectableasloweritem/rule/' + notAMongoId)
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should not be able to create a connection as reader', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', readerToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'Test',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
        });
    });

    it('should not create a connection with an invalid description', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'Test',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should create a connection', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest',
            })
            .end((err, res) => {
                if (res.status !== 201) {
                    console.log(res.status, res.body.data?.errors ?? res.body);
                }
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                expect(res.body).to.have.property(idField);
                expect(res.body).to.have.property(upperItemIdField, items2[0][idField]);
                expect(res.body).to.have.property(lowerItemIdField, items1[0][idField]);
                expect(res.body).to.have.property(ruleIdField, rules2[idField]);
                expect(res.body).to.have.property(typeIdField, rules2[connectionTypeIdField]);
                expect(res.body).to.have.property(descriptionField, 'xTest');
                conn = res.body;
                done();
        });
    });

    it('should get 1 connection as count for item', function(done) {
        chai.request(server)
            .get('/rest/configurationitem/' + items2[0][idField] + '/connections')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 1);
                expect(res.body[0][idField]).to.be.equal(conn[idField]);
                done();
        });
    });

    it('should get 1 connection to lower as count for item', function(done) {
        chai.request(server)
            .get('/rest/configurationitem/' + items2[0][idField] + '/connections/toLower')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 1);
                expect(res.body[0][idField]).to.be.equal(conn[idField]);
                done();
        });
    });

    it('should get 1 connection to upper as count for item', function(done) {
        chai.request(server)
            .get('/rest/configurationitem/' + items1[0][idField] + '/connections/toUpper')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 1);
                expect(res.body[0][idField]).to.be.equal(conn[idField]);
                done();
        });
    });

    it('should read the connection', function(done) {
        chai.request(server)
            .get('/rest/connection/' + conn[idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property(idField, conn[idField]);
                expect(res.body).to.have.property(upperItemIdField, conn[upperItemIdField]);
                expect(res.body).to.have.property(lowerItemIdField, conn[lowerItemIdField]);
                expect(res.body).to.have.property(ruleIdField, conn[ruleIdField]);
                expect(res.body).to.have.property(typeIdField, conn[typeIdField]);
                expect(res.body).to.have.property(descriptionField, conn[descriptionField]);
                done();
        });
    });

    it('should get 1 connection for the rule', function(done) {
        chai.request(server)
            .get('/rest/connectionrule/' + conn[ruleIdField] + '/connections/count')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.equal(1);
                done();
        });
    });

    it('should read the connection by content', function(done) {
        chai.request(server)
            .get('/rest/connection/upperItem/' + conn[upperItemIdField] + '/connectiontype/' + conn[typeIdField] + '/loweritem/' + conn[lowerItemIdField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property(idField, conn[idField]);
                expect(res.body).to.have.property(upperItemIdField, conn[upperItemIdField]);
                expect(res.body).to.have.property(lowerItemIdField, conn[lowerItemIdField]);
                expect(res.body).to.have.property(ruleIdField, conn[ruleIdField]);
                expect(res.body).to.have.property(typeIdField, conn[typeIdField]);
                expect(res.body).to.have.property(descriptionField, conn[descriptionField]);
                done();
        });
    });

    it('should get a validation error reading the connection by content with invalid ids', function(done) {
        chai.request(server)
            .get('/rest/connection/upperItem/' + notAMongoId + '/connectiontype/' + notAMongoId + '/loweritem/' + notAMongoId)
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                expect(res.body.data.errors).to.have.property('length', 3);
                done();
        });
    });

    it('should read the connection', function(done) {
        chai.request(server)
            .get('/rest/connection/' + conn[idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property(idField, conn[idField]);
                expect(res.body).to.have.property(upperItemIdField, items2[0][idField]);
                expect(res.body).to.have.property(lowerItemIdField, items1[0][idField]);
                expect(res.body).to.have.property(ruleIdField, rules2[idField]);
                expect(res.body).to.have.property(typeIdField, rules2[connectionTypeIdField]);
                expect(res.body).to.have.property(descriptionField, 'xTest');
                done();
        });
    });

    it('should not read a connection with a non existing id', function(done) {
        chai.request(server)
            .get('/rest/connection/' + validButNotExistingMongoId)
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(404);
                done();
        });
    });

    it('should get a validation error reading a connection with an invalid id', function(done) {
        chai.request(server)
            .get('/rest/connection/' + notAMongoId)
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should not create a duplicate connection', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should not create a connection to another lower item', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[1][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest2',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should create a connection to another upper item', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[1][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest 2',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                done();
        });
    });

    it('should create a connection to another upper item', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[2][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest 3',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                done();
        });
    });

    it('should create a connection to another upper item', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[3][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest 4',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                done();
        });
    });

    it('should create a connection to another upper item', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[4][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest 5',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                done();
        });
    });

    it('should not create a connection to another upper item, because of exceeding the maximum number', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[5][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest 6',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should not be able to update a connection description as reader', function(done) {
        chai.request(server)
            .put('/rest/connection/' + conn[idField] + '/description')
            .set('Authorization', readerToken)
            .send({
                [descriptionField]: 'xTest 1a',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
        });
    });

    it('should not update a connection description that does not comply to the validation expression of the rule', function(done) {
        chai.request(server)
            .put('/rest/connection/' + conn[idField] + '/description')
            .set('Authorization', editToken)
            .send({
                [descriptionField]: 'Test 1a',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
        });
    });

    it('should update a connection description', function(done) {
        chai.request(server)
            .put('/rest/connection/' + conn[idField] + '/description')
            .set('Authorization', editToken)
            .send({
                [descriptionField]: 'xTest 1a',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                conn = res.body;
                done();
        });
    });

    it('should abandon responsibility for the configuration item ', function(done) {
        chai.request(server)
            .delete('/rest/configurationItem/' + conn[upperItemIdField] + '/responsibility')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[responsibleUsersField]).not.to.include(getAuthObject(1).accountName.toLocaleLowerCase());
                done();
            });
    });

    it('should not update a connection description, if user is not responsible for upper item', function(done) {
        chai.request(server)
            .put('/rest/connection/' + conn[idField] + '/description')
            .set('Authorization', editToken)
            .send({
                [descriptionField]: 'xTest 1b',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
        });
    });

    it('should not delete a connection, if user is not responsible for upper item', function(done) {
        chai.request(server)
            .delete('/rest/connection/' + conn[idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
        });
    });

    it('should not delete a connection description as reader', function(done) {
        chai.request(server)
            .delete('/rest/connection/' + conn[idField])
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
        });
    });

    it('should take responsibility for the configuration item ', function(done) {
        chai.request(server)
            .post('/rest/configurationItem/' + conn[upperItemIdField] + '/responsibility')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[responsibleUsersField]).to.include(getAuthObject(1).accountName.toLocaleLowerCase());
                done();
            });
    });

    it('should delete the connection', function(done) {
        chai.request(server)
            .delete('/rest/connection/' + conn[idField])
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                done();
        });
    });

    it('should read all connections', function(done) {
        chai.request(server)
            .get('/rest/connections')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body.connections).to.be.a('array');
                expect(res.body.connections).to.have.property('length', res.body.totalConnections);
                expect(res.body.connections[0]).to.have.property(typeIdField);
                done();
        });
    });

    it('should abandon responsibility for the configuration item ', function(done) {
        chai.request(server)
            .delete('/rest/configurationItem/' + items2[0][idField] + '/responsibility')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[responsibleUsersField]).not.to.include(getAuthObject(1).accountName.toLocaleLowerCase());
                done();
            });
    });

    it('should not create a connection without responsibility for the upper item', function(done) {
        chai.request(server)
            .post('/rest/connection')
            .set('Authorization', editToken)
            .send({
                [upperItemIdField]: items2[0][idField],
                [lowerItemIdField]: items1[0][idField],
                [ruleIdField]: rules2[idField],
                [typeIdField]: rules2[connectionTypeIdField],
                [descriptionField]: 'xTest',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
        });
    });

    it('should take responsibility for the configuration item again', function(done) {
        chai.request(server)
            .post('/rest/configurationItem/' + conn[upperItemIdField] + '/responsibility')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body[responsibleUsersField]).to.include(getAuthObject(1).accountName.toLocaleLowerCase());
                done();
            });
    });

    it('should find lower items as connectable for rule and item', function(done) {
        chai.request(server)
            .get('/rest/configurationitems/connectableasloweritem/item/' + items2[0][idField] + '/rule/' + rules2[idField])
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 10);
                done();
        });
    });

    it('should find upper items as connectable for rule and item', function(done) {
        chai.request(server)
            .get('/rest/configurationitems/connectableasupperitem/item/' + items1[1][idField] + '/rule/' + rules2[idField])
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 7);
                done();
        });
    });

});

describe('Connection rules and connections', function() {

    it('should mark a connection rule with connections as not deletable', function(done) {
        chai.request(server)
            .get('/rest/connectionrule/' + rules2[idField] + '/candelete')
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.false;
                done();
            });
    });

    it('should not delete a connection rule with active connections', function(done) {
        chai.request(server)
            .delete('/rest/connectionrule/' + rules2[idField])
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should not update a connection rule, when validation expression would not fit', function(done) {
        chai.request(server)
            .put('/rest/connectionrule/' + rules2[idField])
            .set('Authorization', adminToken)
            .send({
                ...rules2,
                [validationExpressionField]: '^xxx.*$',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(409);
                done();
            });
    });

    it('should not update a connection rule, when number of existing connections are larger than allowed', function(done) {
        chai.request(server)
            .put('/rest/connectionrule/' + rules2[idField])
            .set('Authorization', adminToken)
            .send({
                ...rules2,
                [maxConnectionsToUpperField]: 1,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(409);
                done();
            });
    });

});

