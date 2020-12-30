const { expect } = require('chai');
const { userModel } = require('../dist/models/mongoose/user.model');
const { getAuthentication, isAdministrator, isEditor } = require('../dist/controllers/auth/authentication.controller');
const { createUser } = require('../dist/controllers/meta-data/user.controller');
const { acountNameField, accountNameField, roleField } = require('../dist/util/fields.constants');

function getReq() {
    return { 
        ntlm: {
            DomainName: '.',
            Workstation: 'TEST',
            UserName: 'TEST'
        }
    };
}

function getRes() {
    return {
        statusinfo: 0,
        status: function(value) {
            console.log(value);
            this.statusinfo = value;
            return this;
        },
        json: function(value) {
            console.log(value);
            this.payload = value;
        }
    };
}

describe('User administration', function() {
    before(function(done) { // delete any users that may be in database
        userModel.deleteMany({}).then(() => {
            done();
        });
    });

    it('should authenticate', function(done) {
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

    // it('should create a new user', function(done) {
    //     const req = getReq();
    //     req.body = {
    //         [accountNameField]: 'TEST\\TEST2',
    //         [roleField]: 0
    //     };
    //     const res = getRes();
    //     getAuthentication(req, res, () => {
    //         createUser(req, res, (error) => {
    //             console.log(req);
    //             expect(error).to.be.undefined;
    //             expect(res.statusinfo).to.equal(201);
    //             expect(res.payload.name).to.equal('TEST\\TEST2');
    //             done();
    //         })
    //     })
    // });
});