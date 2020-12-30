const { expect } = require('chai');
const mongoose = require('./00-before');
const {userModel} = require('../dist/models/mongoose/user.model');

const { getAuthentication, isAdministrator } = require('../dist/controllers/auth/authentication.controller');

describe('User administration', function() {
    before(function(done) {
        userModel.deleteMany({}).then(() => {
            done();
        });
    });

    it('should authenticate', function(done) {
        const req = { 
            ntlm: {
                DomainName: '.',
                Workstation: 'TEST',
                UserName: 'TEST'
            }
        };
        getAuthentication(req, null, () => {
            expect(req.userName).to.exist;
            expect(req.userName).to.be.equal('TEST\\TEST');
            expect(req.authentication, 'authentication object').to.exist;
            expect(req.authentication.role, 'role').to.exist;
            expect(req.authentication.role, 'role value').to.be.equal(2);
            expect(req.authentication.name, 'name').to.exist;
            expect(req.authentication.name, 'name value').to.equal('TEST\\TEST');
            console.log(req.authentication);
            done();
        });
    });
});