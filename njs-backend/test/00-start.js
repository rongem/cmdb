const { expect } = require('chai')
require('dotenv').config();
process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;

const mongoose = require('mongoose');
const { userModel } = require('../dist/models/mongoose/user.model');
const { attributeGroupModel } = require('../dist/models/mongoose/attribute-group.model');
const { attributeTypeModel } = require('../dist/models/mongoose/attribute-type.model');
const { connectionTypeModel } = require('../dist/models/mongoose/connection-type.model');
const { connectionRuleModel } = require('../dist/models/mongoose/connection-rule.model');
const { itemTypeModel } = require('../dist/models/mongoose/item-type.model');
const { configurationItemModel } = require('../dist/models/mongoose/configuration-item.model');
const { connectionModel } = require('../dist/models/mongoose/connection.model');
const { accountNameField, passphraseField, roleField } = require('../dist/util/fields.constants');

let chai = require('chai');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;

chai.use(chaihttp);

describe('Prerequisites', function() {
    before(function() {
        expect(process.env.TEST_MONGODB_URI, 'missing dburi. Check TEST_MONGODB_URI in .env').not.to.be.null;
    });
    
    it('should contain a valid database connection', function() {
        expect(mongoose.connections.length).to.be.greaterThan(0);
    });

    it('should delete all existing connections', function(done) {
        connectionModel.deleteMany({}).then(() => {
            done();
        });
    });
    it('should delete all existing configuration items', function(done) {
        configurationItemModel.deleteMany({}).then(() => {
            done();
        });
    });
    it('should delete all existing connection rules', function(done) {
        connectionRuleModel.deleteMany({}).then(() => {
            done();
        });
    });
    it('should delete all existing item types', function(done) {
        itemTypeModel.deleteMany({}).then(() => {
            done();
        });
    });
    it('should delete all existing connection types', function(done) {
        connectionTypeModel.deleteMany({}).then(() => {
            done();
        });
    });
    it('should delete all existing attribute types', function(done) {
        attributeTypeModel.deleteMany({}).then(() => {
            done();
        });
    });
    it('should delete all existing attribute groups', function(done) {
        attributeGroupModel.deleteMany({}).then(() => {
            done();
        });
    });
    it('should delete all existing users', function(done) {
        userModel.deleteMany({}).then(() => {
            done();
        });
    })
});

let adminToken, editToken, delToken;

describe('User administration', function() {
    it('should create first user during authentication on empty database', function(done) {
        server = serverexp.default()
        chai.request(server)
            .post('/login')
            .send({
                accountName: 'TestAdmin',
                passphrase: 'vms8XZYz!'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body.token).to.exist;
                adminToken = 'Bearer ' + res.body.token;
                expect(res.body.username).to.be.equal('testadmin');
                done();
            });
    });

    it('should have the admin role (2) for this user', function(done) {
        chai.request(server)
            .get('/rest/user/role')
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(200);
                expect(res.body).to.exist;
                expect(res.body).to.be.equal(2);
                done();
            });
    });

    it('should be able to log in again', function(done) {
        server = serverexp.default()
        chai.request(server)
            .post('/login')
            .send({
                accountName: 'TestAdmin',
                passphrase: 'vms8XZYz!'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body.token).to.exist;
                adminToken = 'Bearer ' + res.body.token;
                expect(res.body.username).to.be.equal('testadmin');
                done();
            });
    });

    it('should not create a new user during authentication with already one in the database', function(done) {
        chai.request(server)
            .post('/login')
            .send({
                accountName: 'TestEditor',
                passphrase: 'vms8XZYz!'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(401);
                done();
            });
    });

    it('should not authenticate existing user with wrong password', function(done) {
        chai.request(server)
            .post('/login')
            .send({
                accountName: 'TestAdmin',
                passphrase: 'qms8XZYz!'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(401);
                done();
            });
    });

    it('should not create a user with wrong role', function(done) {
        chai.request(server)
            .post('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: 'TestWrongRole',
                [roleField]: 4,
                [passphraseField]: 'vms8XZYz!',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should not create a user with weak password', function(done) {
        chai.request(server)
            .post('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: 'TestWeakPassword',
                [roleField]: 0,
                [passphraseField]: 'abc',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should create an editor user', function(done) {
        chai.request(server)
            .post('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: 'TestEditor',
                [roleField]: 0,
                [passphraseField]: 'vms8XZYz!',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(201);
                done();
            });
    });

    it('should create a reader user', function(done) {
        chai.request(server)
            .post('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: 'TestReader',
                [roleField]: 0,
                [passphraseField]: 'vms8XZYz!',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(201);
                done();
            });
    });

    it('should create a user for deletion', function(done) {
        chai.request(server)
            .post('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: 'TestDelete',
                [roleField]: 0,
                [passphraseField]: 'vms8XZYz!',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(201);
                done();
            });
    });

    it('should log in as TestDelete', function(done) {
        chai.request(server)
        .post('/login')
        .send({
            accountName: 'TestDelete',
            passphrase: 'vms8XZYz!'
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(200);
            delToken = 'Bearer ' + res.body.token;
            done();
        });
   
    });

    it('should not create a duplicate reader user', function(done) {
        chai.request(server)
            .post('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: 'TestReader',
                [roleField]: 0,
                [passphraseField]: 'vms8XZYz!',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should detect that no real update is done', function(done) {
        chai.request(server)
            .put('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: 'TestEditor',
                [roleField]: 0,
                [passphraseField]: 'vms8XZYz!',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(304);
                done();
            });
    });

    it('should detect that no real update is done with omitted passphrase', function(done) {
        chai.request(server)
            .put('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: 'TestEditor',
                [roleField]: 0,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(304);
                done();
            });
    });

    it('should update user to editor', function(done) {
        chai.request(server)
            .put('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: 'TestEditor',
                [roleField]: 1,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(200);
                expect(res.body.role).to.be.equal(1);
                done();
            });
    });

    it('should delete a user', function(done) {
        chai.request(server)
            .delete('/rest/user/TestDelete/1')
            .set('Authorization', adminToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it('should prevent a deleted user from using his token', function(done) {
        chai.request(server)
            .get('/rest/user/current')
            .set('Authorization', delToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(401);
                done();
            });
    })

});

describe('Editor user', function() {
    before(function(done) {
        chai.request(server)
            .post('/login')
            .send({
                accountName: 'TestEditor',
                passphrase: 'vms8XZYz!'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                editToken = 'Bearer ' + res.body.token;
                expect(res.body.username).to.be.equal('testeditor');
                done();
            });
    });

    it('should not be allowed to create a user', function(done) {
        chai.request(server)
        .post('/rest/user')
        .set('Authorization', editToken)
        .send({
            [accountNameField]: 'TestWithMissingRole',
            [roleField]: 0,
            [passphraseField]: 'vms8XZYz!',
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.property('status');
            expect(res.status).to.be.equal(403);
            done();
        });
    });

    it('should not be allowed to update an existing user', function(done) {
        chai.request(server)
            .put('/rest/user')
            .set('Authorization', editToken)
            .send({
                [accountNameField]: 'TestReader',
                [roleField]: 1,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should update his passphrase', function(done) {
        chai.request(server)
            .patch('/rest/user/passphrase')
            .set('Authorization', editToken)
            .send({
                [passphraseField]: 'TestEdit1#',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it('should be able to login with the new password', function(done) {
        chai.request(server)
            .post('/login')
            .send({
                accountName: 'TestEditor',
                passphrase: 'TestEdit1#'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                editToken = 'Bearer ' + res.body.token;
                expect(res.body.username).to.be.equal('testeditor');
                done();
            });
    });

    it('should not be allowed to update an existing user', function(done) {
        chai.request(server)
            .put('/rest/user')
            .set('Authorization', editToken)
            .send({
                [accountNameField]: 'TestReader',
                [roleField]: 1,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should not be allowed to delete a user', function(done) {
        chai.request(server)
            .delete('/rest/user/Testreader/1')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.property('status');
                expect(res.status).to.be.equal(403);
                done();
            });
    });

})

