const { expect } = require('chai');
const { getResponse } = require('./01-functions');
const { getAttributeGroups } = require('../dist/controllers/meta-data/attribute-group.controller');
const { createAttributeType, updateAttributeType, deleteAttributeType, getAttributeTypes } = require('../dist/controllers/meta-data/attribute-type.controller');
const { nameField, idField, attributeGroupIdField, validationExpressionField } = require('../dist/util/fields.constants');

let attributeGroups;
let attributeType;
const ipAddressName = 'IP address';

function testSuccessfulCreatingAttribute(done, name, group) {
    const req = {
        body: {
            [nameField]: name,
            [attributeGroupIdField]: group,
            [validationExpressionField]: '^.*$'
        }
    };
    const res = getResponse(() => {
        expect(res.statusinfo).to.be.equal(201);
        attributeType = res.payload;
        done();
    });
    createAttributeType(req, res, null);
    return res;
}

describe('Attribute types', function() {
    before(function(done) {
        const res = getResponse(() => {
            attributeGroups = res.payload;
            done();
        });
        getAttributeGroups(null, res, null);
    });

    it('should contain 2 attribute groups', function() {
        expect(attributeGroups.length).to.be.equal(2);
    });

    it('should create an ip address attribute', function(done) {
        testSuccessfulCreatingAttribute(done, ipAddressName, attributeGroups[1][idField]);
    });

    it('should not create a second ip address attribute', function(done) {
        const req = {
            body: {
                [nameField]: ipAddressName,
                [attributeGroupIdField]: attributeGroups[1][idField],
                [validationExpressionField]: '^.*$'
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).not.to.be.equal(201);
            done();
        });
        createAttributeType(req, res, (error) => {
            expect(error).not.to.be.undefined;
            expect(error.httpStatusCode).to.exist;
            expect(error.httpStatusCode).to.be.equal(422);
            done();
        });
    });

    it('should create a serial attribute', function(done) {
        testSuccessfulCreatingAttribute(done, 'Serial', attributeGroups[0][idField]);
    });

    it('should not update an attribute type to a duplicate name', function(done) {
        const req = {
            body: {
                [idField]: attributeType.id,
                [nameField]: ipAddressName,
                [attributeGroupIdField]: attributeType[attributeGroupIdField],
                [validationExpressionField]: attributeType[validationExpressionField]
            },
            params: {
                [idField]: attributeType.id
            }
        };
        updateAttributeType(req, null, (error) => {
            expect(error).not.to.be.undefined;
            expect(error.httpStatusCode).to.exist;
            expect(error.httpStatusCode).to.be.equal(422);
            done();
        });
    });

    it('should update an attribute type', function(done) {
        const req = {
            body: {
                [idField]: attributeType.id,
                [nameField]: 'Serial number',
                [attributeGroupIdField]: attributeType[attributeGroupIdField],
                [validationExpressionField]: attributeType[validationExpressionField]
            },
            params: {
                [idField]: attributeType.id
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(200);
            done();
        });
        updateAttributeType(req, res, null);
    });

    it('should create a manufacturer attribute', function(done) {
        testSuccessfulCreatingAttribute(done, 'Manufacturer', attributeGroups[0][idField]);
    });

    it('should create a model attribute', function(done) {
        testSuccessfulCreatingAttribute(done, 'Model', attributeGroups[0][idField]);
    });

    it('should create a waste attribute', function(done) {
        testSuccessfulCreatingAttribute(done, 'Waste', attributeGroups[0][idField]);
    });

    it('should delete an attribute type', function(done) {
        const req = {
            params: {
                [idField]: attributeType.id
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(200);
            done();
        });
        deleteAttributeType(req, res, null);
    });
});
