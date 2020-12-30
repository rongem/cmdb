const { expect } = require('chai');
const { getRes } = require('./01-functions');
const { createAttributeGroup, updateAttributeGroup, deleteAttributeGroup, getAttributeGroups } = require('../dist/controllers/meta-data/attribute-group.controller');
const { nameField, idField } = require('../dist/util/fields.constants');

let attributeGroup;

describe('Attribute groups', function() {
    it('should create an attribute group', function(done) {
        const req = {
            body: {
                [nameField]: 'Attibute Group 1'
            }
        };
        const res = getRes(() => {
            expect(res.statusinfo).to.be.equal(201);
            done();
        });
        createAttributeGroup(req, res, null);
    });

    it('should not create a duplicate attribute group', function(done) {
        const req = {
            body: {
                [nameField]: 'Attibute Group 1'
            }
        };
        createAttributeGroup(req, null, (error) => {
            expect(error).not.to.be.undefined;
            expect(error.httpStatusCode).to.exist;
            expect(error.httpStatusCode).to.be.equal(422);
            done();
        });
    });

    it('should create a second attribute group', function(done) {
        const req = {
            body: {
                [nameField]: 'Attibute Group 2'
            }
        };
        const res = getRes(() => {
            expect(res.statusinfo).to.be.equal(201);
            attributeGroup = res.payload;
            done();
        });
        createAttributeGroup(req, res, null);
    });

    it('should not update an attribute group to a duplicate name', function(done) {
        const req = {
            body: {
                [idField]: attributeGroup.id,
                [nameField]: 'Attibute Group 1'
            },
            params: {
                [idField]: attributeGroup.id
            }
        };
        updateAttributeGroup(req, null, (error) => {
            expect(error).not.to.be.undefined;
            expect(error.httpStatusCode).to.exist;
            expect(error.httpStatusCode).to.be.equal(422);
            done();
        });
    });

    it('should update an attribute group', function(done) {
        const req = {
            body: {
                [idField]: attributeGroup.id,
                [nameField]: 'Attibute Group 3'
            },
            params: {
                [idField]: attributeGroup.id
            }
        };
        const res = getRes(() => {
            expect(res.statusinfo).not.to.be.equal(201);
            done();
        });
        updateAttributeGroup(req, res, null);
    });

    it('should delete an attribute group', function(done) {
        const req = {
            params: {
                [idField]: attributeGroup.id
            }
        };
        const res = getRes(() => {
            expect(res.statusinfo).to.be.equal(200);
            done();
        });
        deleteAttributeGroup(req, res, null);
    });

    it('should get one attribute group', function(done) {
        const res = getRes(() => {
            expect(res.statusinfo).to.be.equal(200);
            expect(res.payload).to.exist;
            expect(res.payload.length).to.be.equal(1);
            done();
        });
        getAttributeGroups(null, res, null);
    })
});