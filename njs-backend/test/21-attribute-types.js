const { expect } = require('chai')
const { nameField, attributeGroupIdField, idField, validationExpressionField } = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getAuthObject } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken, readerToken;
let attributeGroups;
let attributeType;
const ipAddressName = 'IP address';

function testSuccessfulCreatingAttribute(done, name, group, validationExpression = '^.*$') {
    chai.request(server)
        .post('/rest/attributetype')
        .set('Authorization', adminToken)
        .send({
            [nameField]: name,
            [attributeGroupIdField]: group,
            [validationExpressionField]: validationExpression,
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(201);
            expect(res.body).to.have.property(nameField, name);
            expect(res.body).to.have.property(attributeGroupIdField, group);
            expect(res.body).to.have.property(validationExpressionField, validationExpression);
            attributeType = res.body;
            done();
    });
}

describe('Attribute types', function() {
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

    it('should create an attribute type', function(done) {
        testSuccessfulCreatingAttribute(done, ipAddressName, attributeGroups[1][idField]);
    });
});