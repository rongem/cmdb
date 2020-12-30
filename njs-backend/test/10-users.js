const { expect } = require('chai');
const { userModel } = require('../dist/models/mongoose/user.model');
const { getAuthentication, isAdministrator, isEditor } = require('../dist/controllers/auth/authentication.controller');
const { createUser, updateUser } = require('../dist/controllers/meta-data/user.controller');
const { accountNameField, roleField } = require('../dist/util/fields.constants');
const { userNotAdminMsg, userNotEditorMsg } = require('../dist/util/messages.constants');

function getReq() {
    return { 
        ntlm: {
            DomainName: '.',
            Workstation: 'TEST',
            UserName: 'TEST'
        }
    };
}

function getRes(callback) {
    return {
        statusinfo: 0,
        status: function(value) {
            this.statusinfo = value;
            if (value === 304) {
                callback();
            }
            return this;
        },
        json: function(value) {
            if (this.statusinfo === 0) {
                this.statusinfo = 200;
            }
            this.payload = value;
            callback();
        }
    };
}

describe('User administration', function() {
    before(function(done) { // delete any users that may be in database
        userModel.deleteMany({}).then(() => {
            done();
        });
    });

    it('should authenticate first user', function(done) {
        const req = getReq();
        const userName = req.ntlm.Workstation + '\\' + req.ntlm.UserName;

        getAuthentication(req, null, (error) => {
            expect(error).to.be.undefined;
            expect(req.userName).to.exist;
            expect(req.userName).to.be.equal(userName);
            expect(req.authentication, 'authentication object').to.exist;
            expect(req.authentication.role, 'role').to.exist;
            expect(req.authentication.role, 'role value').to.be.equal(2);
            expect(req.authentication.name, 'name').to.exist;
            expect(req.authentication.name, 'name value').to.equal(userName);
            done();
        });
    });

    it('should be in administrator role', function(done) {
        const req = getReq();
        getAuthentication(req, null, () => {
            isAdministrator(req, null, (error) => {
                expect(error).to.be.undefined;
                done();
            });
        });
    });

    it('should be in editor role', function(done) {
        const req = getReq();
        getAuthentication(req, null, () => {
            isEditor(req, null, (error) => {
                expect(error).to.be.undefined;
                done();
            });
        });
    });

    it('should authenticate a second user', function(done) {
        const req = getReq();
        req.ntlm.UserName += '1';
        const userName = req.ntlm.Workstation + '\\' + req.ntlm.UserName;

        getAuthentication(req, null, (error) => {
            expect(error).to.be.undefined;
            expect(req.userName).to.exist;
            expect(req.userName).to.be.equal(userName);
            expect(req.authentication, 'authentication object').to.exist;
            expect(req.authentication.role, 'role').to.exist;
            expect(req.authentication.role, 'role value').to.be.equal(2);
            expect(req.authentication.name, 'name').to.exist;
            expect(req.authentication.name, 'name value').to.equal(userName);
            done();
        });
    });

    it('should update the first user to explicit administrator', function(done) {
        const req = {
            body: {
                [accountNameField]: 'TEST\\TEST',
                [roleField]: 2
            }
        };
        const res = getRes(() => {
            expect(res.statusinfo).to.be.equal(200);
            done();
        })
        updateUser(req, res, (error) => {
            console.log(error);
        });
    });

    it('should not find the second user in administrator role', function(done) {
        const req = getReq();
        req.ntlm.UserName += '1';
        getAuthentication(req, null, () => {
            isAdministrator(req, null, (error) => {
                expect(error).not.to.be.undefined;
                done();
            });
        });
    });

    // it('should not be in editor role', function(done) {
    //     const req = getReq();
    //     req.ntlm.UserName += '1';
    //     getAuthentication(req, null, () => {
    //         expect(isEditor(req, null, null)).to.throw(userNotEditorMsg);
    //         done();
    //     });
    // });

    // it('should create a new user', function(done) {
    //     const req = {
    //         body: {
    //             [accountNameField]: 'TEST\\TEST2',
    //             [roleField]: 0
    //         }
    //     };
    //     const res = getRes(() => {
    //         expect(res.statusinfo).to.equal(201);
    //         expect(res.payload.name).to.equal('TEST\\TEST2');
    //         done();
    //     });
    //     createUser(req, res, null);
    // });
});