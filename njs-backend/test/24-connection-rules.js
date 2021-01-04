const { expect } = require('chai')
const {
    upperItemTypeIdField,
    lowerItemTypeIdField,
    connectionTypeIdField,
    validationExpressionField,
    idField,
    maxConnectionsToLowerField,
    maxConnectionsToUpperField
} = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getAuthObject } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken;
let itemTypes, connectionTypes;

describe('Connection Rules', function() {
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
            .get('/rest/itemtypes')
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(1);
                itemTypes = res.body;
                done();
            });
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/connectiontypes')
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(1);
                connectionTypes = res.body;
                done();
            });
    });

    it('should create a connection rule', function(done) {
        chai.request(server)
            .post('/rest/connectionrule')
            .set('Authorization', adminToken)
            .send({
                [upperItemTypeIdField]: itemTypes[0][idField],
                [lowerItemTypeIdField]: itemTypes[1][idField],
                [connectionTypeIdField]: connectionTypes[0][idField],
                [maxConnectionsToLowerField]: 1,
                [maxConnectionsToUpperField]: 1,
                [validationExpressionField]: '^.*$',
            })
            .end((err, res) => {
                console.log(res.body);
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                done();
            })
    })

});
