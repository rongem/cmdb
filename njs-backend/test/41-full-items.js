const { expect } = require('chai')
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
} = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getToken, getAuthObject } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken, readerToken;
let itemTypes, items0, items1, items2, rules0, rules2;

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
                [nameField]: 'Full enclosure 1',
                [typeIdField]: itemTypes[0][idField],
                [connectionsToLowerField]: [{
                    [targetIdField]: items1[0][idField],
                    [ruleIdField]: rules0[idField],
                    [descriptionField]: 'xTest',
                }]
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                expect(res.body).to.have.property(nameField, 'Full enclosure 1');
                expect(res.body).to.have.property(typeIdField, itemTypes[0][idField]);
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

});
