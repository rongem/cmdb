const { expect } = require('chai');
const { getAuthentication, isAdministrator, isEditor } = require('../dist/controllers/auth/authentication.controller');
const { createUser, updateUser, deleteUser } = require('../dist/controllers/meta-data/user.controller');
const { accountNameField, roleField, nameField, domainField, withResponsibilitiesField } = require('../dist/util/fields.constants');
const { getAdminAuthReq, getEditorAuthReq, getResponse, workstationName, adminUsername, editorUsername } = require('./01-functions');

const chai = require('chai');
const chaiHttp = require('chai-http');


describe('User administration', function() {
    it('should authenticate first user', function(done) {
        const req = getAdminAuthReq();
        const userName = req.ntlm.Workstation + '\\' + req.ntlm.UserName;

        getAuthentication(req, null, (error) => {
            expect(error).to.be.undefined;
            expect(req.userName).to.exist;
            expect(req.userName).to.be.equal(userName);
            expect(req.authentication, 'authentication object').to.exist;
            expect(req.authentication.role, 'role').to.exist;
            expect(req.authentication.role, 'role value').to.be.equal(2);
            expect(req.authentication.name, 'name').to.exist;
            expect(req.authentication.name, 'name value').to.be.equal(userName);
            done();
        });
    });

    it('should be in administrator role', function(done) {
        const req = getAdminAuthReq();
        getAuthentication(req, null, () => {
            isAdministrator(req, null, (error) => {
                expect(error).to.be.undefined;
                done();
            });
        });
    });

    it('should be in editor role', function(done) {
        const req = getAdminAuthReq();
        getAuthentication(req, null, () => {
            isEditor(req, null, (error) => {
                expect(error).to.be.undefined;
                done();
            });
        });
    });

    it('should authenticate a second user', function(done) {
        const req = getEditorAuthReq();
        const userName = req.ntlm.Workstation + '\\' + req.ntlm.UserName;

        getAuthentication(req, null, (error) => {
            expect(error).to.be.undefined;
            expect(req.userName).to.exist;
            expect(req.userName).to.be.equal(userName);
            expect(req.authentication, 'authentication object').to.exist;
            expect(req.authentication.role, 'role').to.exist;
            expect(req.authentication.role, 'role value').to.be.equal(2);
            expect(req.authentication.name, 'name').to.exist;
            expect(req.authentication.name, 'name value').to.be.equal(userName);
            done();
        });
    });

    it('should update the first user to explicit administrator', function(done) {
        const req = {
            body: {
                [accountNameField]: workstationName + '\\' + adminUsername,
                [roleField]: 2
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(200);
            done();
        })
        updateUser(req, res, (error) => {
            console.log(error);
        });
    });

    it('should not find the second user in administrator role', function(done) {
        const req = getEditorAuthReq();
        getAuthentication(req, null, () => {
            isAdministrator(req, null, (error) => {
                expect(error).not.to.be.undefined;
                expect(error.httpStatusCode).to.be.equal(403);
                done();
            });
        });
    });

    it('should not find the second user in editor role', function(done) {
        const req = getEditorAuthReq();
        getAuthentication(req, null, () => {
            isEditor(req, null, (error) => {
                expect(error).not.to.be.undefined;
                expect(error.httpStatusCode).to.be.equal(403);
                done();
            });
        });
    });

    it('should update the second user to editor', function(done) {
        const req = {
            body: {
                [accountNameField]: workstationName + '\\' + editorUsername,
                [roleField]: 1
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(200);
            done();
        })
        updateUser(req, res, (error) => {
            console.log(error);
        });
    });

    it('should find the second user in editor role now', function(done) {
        const req = getEditorAuthReq();
        getAuthentication(req, null, () => {
            isEditor(req, null, (error) => {
                expect(error).to.be.undefined;
                done();
            });
        });
    });

    it('should create a new user', function(done) {
        const req = {
            body: {
                [accountNameField]: workstationName + '\\TEST2',
                [roleField]: 1
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(201);
            done();
        });
        createUser(req, res, null);
    });

    it('should fail creating a new user with an existing name', function(done) {
        const req = {
            body: {
                [accountNameField]: workstationName + '\\TEST2',
                [roleField]: 1
            }
        };
        createUser(req, null, (error) => {
            expect(error).not.to.be.undefined;
            expect(error.httpStatusCode).to.exist;
            expect(error.httpStatusCode).to.be.equal(422);
            done();
        });
    });

    it('should delete a user', function(done) {
        const req = {
            params: {
                [domainField]: workstationName,
                [nameField]: 'TEST2',
                [withResponsibilitiesField]: 1
            }
        };
        const res = getResponse(() => {
            expect(res.statusinfo).to.be.equal(200);
            done();
        });
        deleteUser(req, res, null)
    });
});
