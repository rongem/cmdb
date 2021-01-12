const { expect } = require('chai')
const { accountNameField, passphraseField, roleField } = require('../dist/util/fields.constants');
const { getAuthObject } = require('./01-functions');

let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;

let chai = require('chai');

chai.use(chaihttp);


let adminToken, editToken, delToken;

describe('User administration', function() {
    it('should create first user during authentication on empty database', function(done) {
        server = serverexp.default()
        chai.request(server)
            .post('/login')
            .send(getAuthObject(2))
            .end((err, res) => {
                expect(err).to.be.null;
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
            .send(getAuthObject(2))
            .end((err, res) => {
                expect(err).to.be.null;
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
            .send(getAuthObject(1))
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(401);
                done();
            });
    });

    it('should not authenticate existing user with wrong password', function(done) {
        chai.request(server)
            .post('/login')
            .send({
                ...getAuthObject(2),
                [passphraseField]: 'qms8XZYz!'
            })
            .end((err, res) => {
                expect(err).to.be.null;
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
                [passphraseField]: 'AbCd3FgH!',
            })
            .end((err, res) => {
                expect(err).to.be.null;
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
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should create an editor user', function(done) {
        chai.request(server)
            .post('/rest/user')
            .set('Authorization', adminToken)
            .send({
                ...getAuthObject(1),
                [roleField]: 0,
                [passphraseField]: 'vms8XZYz!',
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                done();
            });
    });

    it('should create a reader user', function(done) {
        chai.request(server)
            .post('/rest/user')
            .set('Authorization', adminToken)
            .send({
                ...getAuthObject(0),
                [roleField]: 0,
            })
            .end((err, res) => {
                expect(err).to.be.null;
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
                [passphraseField]: 'abc8XZYz!'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
                done();
            });
    });

    it('should log in as TestDelete', function(done) {
        chai.request(server)
        .post('/login')
        .send({
            [accountNameField]: 'TestDelete',
            [passphraseField]: 'abc8XZYz!'
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
                ...getAuthObject(0),
                [roleField]: 0,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should detect that no real update is done', function(done) {
        chai.request(server)
            .put('/rest/user')
            .set('Authorization', adminToken)
            .send({
                ...getAuthObject(1),
                [roleField]: 0,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(304);
                done();
            });
    });

    it('should detect that no real update is done with omitted passphrase', function(done) {
        chai.request(server)
            .put('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: getAuthObject(1)[accountNameField],
                [roleField]: 0,
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(304);
                done();
            });
    });

    it('should update user to editor', function(done) {
        chai.request(server)
            .put('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: getAuthObject(1)[accountNameField],
                [roleField]: 1,
            })
            .end((err, res) => {
                expect(err).to.be.null;
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
                expect(res.status).to.be.equal(401);
                done();
            });
    })

});

describe('User without admin role', function() {
    before(function(done) {
        chai.request(server)
            .post('/login')
            .send(getAuthObject(1))
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
            [accountNameField]: 'TestWithMissingPrivilege',
            [roleField]: 0,
            [passphraseField]: 'abc8XZYz!',
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.be.equal(403);
            done();
        });
    });

    it('should not be allowed to update an existing user', function(done) {
        chai.request(server)
            .put('/rest/user')
            .set('Authorization', editToken)
            .send({
                [accountNameField]: getAuthObject(0)[accountNameField],
                [roleField]: 1,
            })
            .end((err, res) => {
                expect(err).to.be.null;
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
                [accountNameField]: getAuthObject(1)[accountNameField],
                [passphraseField]: 'TestEdit1#'
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                editToken = 'Bearer ' + res.body.token;
                expect(res.body.username).to.be.equal('testeditor');
                done();
            });
    });

    it('should not be allowed to delete a user', function(done) {
        chai.request(server)
            .delete('/rest/user/Testreader/1')
            .set('Authorization', editToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    after(function(done) {
        chai.request(server)
            .patch('/rest/user/passphrase')
            .set('Authorization', editToken)
            .send({
                [passphraseField]: getAuthObject(1)[passphraseField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                done();
            });
    });

})

