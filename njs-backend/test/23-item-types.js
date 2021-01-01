const { expect } = require('chai');
const { getResponse } = require('./01-functions');
const { createItemType, updateItemType, deleteItemType, getItemTypes } = require('../dist/controllers/meta-data/item-type.controller');
const { nameField, idField, colorField, attributeGroupsField } = require('../dist/util/fields.constants');
const { getAttributeGroups } = require('../dist/controllers/meta-data/attribute-group.controller');

let chai = require('chai');
let chaiHttp = require('chai-http');

let itemType;
let attributeGroups;

const serverHardware = 'Rack server hardware';
const rackName = 'Rack';

describe('Item types', function() {
    before(function(done) {
        const res = getResponse(() => {
            attributeGroups = res.payload;
            done();
        });
        getAttributeGroups(null, res, null);
    });

    it('should create an item type', function(done) {
        const req = {
            body: {
                [nameField]: serverHardware,
                [colorField]: '#FFFFFF',
                [attributeGroupsField]: attributeGroups
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(201);
            done();
        });
        createItemType(req, res, null);
    });

    it('should not create a duplicate item type', function(done) {
        const req = {
            body: {
                [nameField]: serverHardware,
                [colorField]: '#000000'
            }
        };
        createItemType(req, null, (error) => {
            expect(error).not.to.be.undefined;
            expect(error.httpStatusCode).to.exist;
            expect(error.httpStatusCode).to.be.equal(422);
            done();
        });
    });

    it('should create a second item type', function(done) {
        const req = {
            body: {
                [nameField]: 'Dummy Hardware',
                [colorField]: '#000000',
                [attributeGroupsField]: [attributeGroups[0]]
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(201);
            itemType = res.payload;
            done();
        });
        createItemType(req, res, null);
    });

    it('should not update an item type to a duplicate name', function(done) {
        const req = {
            body: {
                [idField]: itemType.id,
                [nameField]: serverHardware,
                [colorField]: '#000000',
                [attributeGroupsField]: [attributeGroups[0]]
            },
            params: {
                [idField]: itemType.id
            }
        };
        updateItemType(req, null, (error) => {
            expect(error).not.to.be.undefined;
            expect(error.httpStatusCode).to.exist;
            expect(error.httpStatusCode).to.be.equal(422);
            done();
        });
    });

    it('should update an item type', async function() {
        const req = {
            body: {
                ...itemType,
                [nameField]: 'Blade enclosure',
                [colorField]: '#FFFFFF',
            },
            params: {
                [idField]: itemType.id
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(200);
            expect(res.payload.attributeGroups.length).to.be.equal(1);
            // done();
        });
        await updateItemType(req, res, null);
    });

    it('should delete an item type', function(done) {
        const req = {
            params: {
                [idField]: itemType.id
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(200);
            done();
        });
        deleteItemType(req, res, null);
    });

    it('should retrieve one item type', function(done) {
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(200);
            expect(res.payload).to.exist;
            expect(res.payload.length).to.be.equal(1);
            itemType = res.payload[0];
            done();
        });
        getItemTypes(null, res, null);
    });

});