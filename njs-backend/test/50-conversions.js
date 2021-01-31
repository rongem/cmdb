const { expect } = require('chai')
const {
    idField,
    nameField,
    newItemTypeNameField,
    positionField,
    colorField,
    connectionTypeIdField,
    attributeTypesToTransferField,
} = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getToken, validButNotExistingMongoId, notAMongoId } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let adminToken, readerToken;
let connectionTypes, attributeTypes, attributeTypeToConvert, accompanyingType;

describe('Search configuration items', function() {
    before(function() {
        adminToken = getToken('admin');
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
                attributeTypeToConvert = attributeTypes.find(a => a[nameField] === 'Model');
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

    it('should get a validation error with a non existing attribute type', function(done) {
        chai.request(server)
            .get('/rest/attributetype/' + validButNotExistingMongoId + '/correspondingvaluesoftype')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should get a validation error with an invalid id', function(done) {
        chai.request(server)
            .get('/rest/attributetype/' + notAMongoId + '/correspondingvaluesoftype')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should get 3 attribute types that have equal attributes', function(done) {
        chai.request(server)
            .get('/rest/attributetype/' + attributeTypeToConvert[idField] + '/correspondingvaluesoftype')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.property('length', 3);
                accompanyingType = res.body.find(a => a[nameField] === 'Status');
                done();
            });
    });

    it('should get validation errors with wrong parameters for conversion', function(done) {
        chai.request(server)
            .move('/rest/attributetype/' + notAMongoId)
            .set('Authorization', readerToken)
            .send({
                [newItemTypeNameField]: '',
                [positionField]: 'x',
                [colorField]: 'noColor',
                [connectionTypeIdField]: validButNotExistingMongoId,
                [attributeTypesToTransferField]: [
                    validButNotExistingMongoId,
                    notAMongoId,
                ]
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                expect(res.body.data.errors).to.have.property('length', 5);
                done();
            });
    });

    it('should get validation errors with wrong parameters for conversion', function(done) {
        chai.request(server)
            .move('/rest/attributetype/' + attributeTypeToConvert[idField])
            .set('Authorization', readerToken)
            .send({
                [newItemTypeNameField]: '',
                [connectionTypeIdField]: notAMongoId,
                [attributeTypesToTransferField]: [
                    validButNotExistingMongoId,
                    accompanyingType[idField],
                ]
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                expect(res.body.data.errors).to.have.property('length', 4);
                done();
            });
    });

    it('should convert attribute type to item type', function(done) {
        chai.request(server)
            .move('/rest/attributetype/' + attributeTypeToConvert[idField])
            .set('Authorization', readerToken)
            .send({
                [newItemTypeNameField]: '',
                [positionField]: 'below',
                [colorField]: '#FFFFFF',
                [connectionTypeIdField]: connectionTypes[0][idField],
                [attributeTypesToTransferField]: [
                    accompanyingType[idField]
                ]
            })
            .end((err, res) => {
                expect(err).to.be.null;
                console.log(res.body.data ?? res.body);
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property('itemType');
                expect(res.body.itemType).to.have.property('id');
                expect(res.body).to.have.property('items');
                expect(res.body.items).to.be.a('array');
                expect(res.body).to.have.property('connections');
                expect(res.body.connections).to.be.a('array');
                expect(res.body).to.have.property('deletedAttributeType');
                expect(res.body.deletedAttributeType).to.have.property('id', attributeTypeToConvert[idField]);
                done();
            });
    });

});