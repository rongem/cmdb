const { expect } = require('chai');
const { getResponse } = require('./01-functions');
const { createConnectionType, updateConnectionType, deleteConnectionType, getConnectionTypes } = require('../dist/controllers/meta-data/connection-type.controller');
const { nameField, idField, reverseNameField } = require('../dist/util/fields.constants');

let chai = require('chai');
let chaiHttp = require('chai-http');

let connectionType;

const forwardName = 'is built into';
const reverseName = 'contains';

describe('Connection types', function() {
    it('should create a connection type', function(done) {
        const req = {
            body: {
                [nameField]: forwardName,
                [reverseNameField]: reverseName,
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(201);
            done();
        });
        createConnectionType(req, res, null);
    });

    it('should not create a duplicate connection type', function(done) {
        const req = {
            body: {
                [nameField]: forwardName,
                [reverseNameField]: reverseName,
            }
        };
        createConnectionType(req, null, (error) => {
            expect(error).not.to.be.undefined;
            expect(error.httpStatusCode).to.exist;
            expect(error.httpStatusCode).to.be.equal(422);
            done();
        });
    });

    it('should create a second connection type', function(done) {
        const req = {
            body: {
                [nameField]: 'runs in',
                [reverseNameField]: 'contains',
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(201);
            connectionType = res.payload;
            done();
        });
        createConnectionType(req, res, null);
    });

    it('should not update a connection type to duplicate names', function(done) {
        const req = {
            body: {
                [idField]: connectionType.id,
                [nameField]: forwardName,
                [reverseNameField]: reverseName

            },
            params: {
                [idField]: connectionType.id
            }
        };
        updateConnectionType(req, null, (error) => {
            expect(error).not.to.be.undefined;
            expect(error.httpStatusCode).to.exist;
            expect(error.httpStatusCode).to.be.equal(422);
            done();
        });
    });

    it('should update a connection type', function(done) {
        const req = {
            body: {
                [idField]: connectionType.id,
                [nameField]: connectionType[nameField],
                [reverseNameField]: 'provides'
            },
            params: {
                [idField]: connectionType.id
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(200);
            expect(res.payload[reverseNameField]).to.be.equal('provides');
            done();
        });
        updateConnectionType(req, res, null);
    });

    it('should create a second connection type', function(done) {
        const req = {
            body: {
                [nameField]: 'runs in',
                [reverseNameField]: 'contains',
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(201);
            connectionType = res.payload;
            done();
        });
        createConnectionType(req, res, null);
    });

    it('should delete a connection type', function(done) {
        const req = {
            params: {
                [idField]: connectionType.id
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(200);
            done();
        });
        deleteConnectionType(req, res, null);
    });

    it('should retrieve 2 connection types', function(done) {
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(200);
            expect(res.payload).to.exist;
            expect(res.payload.length).to.be.equal(2);
            connectionType = res.payload[0];
            done();
        });
        getConnectionTypes(null, res, null);
    });
});