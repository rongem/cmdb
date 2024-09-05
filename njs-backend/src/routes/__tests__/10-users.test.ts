import request from 'supertest';
import { app } from '../../app';

import { accountNameField, passphraseField, roleField } from '../../util/fields.constants';
import { getAuthObject } from '../../test/functions';

let adminToken: string, editToken: string, delToken: string;
describe('User administration', () => {
    it('should create first user during authentication on empty database', () => {
        return request(app)
            .post('/login')
            .send(getAuthObject(2))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.token).toBeDefined();
                expect(response.body.username).toBe('testadmin');
                adminToken = 'Bearer ' + response.body.token;
            });
    });

    it('should have the admin role (2) for this user', () => {
        return request(app)
            .get('/rest/user/role')
            .set('Authorization', adminToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toBe(2);
            });
    });

    it('should be able to log in again', () => {
        return request(app)
            .post('/login')
            .send(getAuthObject(2))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.token).toBeDefined();
                expect(response.body.username).toBe('testadmin');
                adminToken = 'Bearer ' + response.body.token;
            });
    });

    it('should not create a new user during authentication with already one in the database', () => {
        return request(app)
            .post('/login')
            .send(getAuthObject(1))
            .expect(401);
    });

    it('should not authenticate existing user with wrong password', () => {
        return request(app)
            .post('/login')
            .send({
                ...getAuthObject(2),
                [passphraseField]: 'qms8XZYz!'
            })
            .expect(401);
    });

    it('should not create a user with wrong role', () => {
        return request(app)
            .post('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: 'TestWrongRole',
                [roleField]: 4,
                [passphraseField]: 'AbCd3FgH!',
            })
            .expect(400);
    });

    it('should not create a user with weak password', () => {
        return request(app)
            .post('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: 'TestWeakPassword',
                [roleField]: 0,
                [passphraseField]: 'abc',
            })
            .expect(400);
    });

    it('should create an editor user', () => {
        return request(app)
            .post('/rest/user')
            .set('Authorization', adminToken)
            .send({
                ...getAuthObject(1),
                [roleField]: 0,
                [passphraseField]: 'vms8XZYz!',
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.status).toBe(201);
            });
    });

    it('should create a reader user', () => {
        return request(app)
            .post('/rest/user')
            .set('Authorization', adminToken)
            .send({
                ...getAuthObject(0),
                [roleField]: 0,
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.status).toBe(201);
            });
    });

    it('should be able to login as reader user', () => {
        return request(app)
            .post('/login')
            .send({
                ...getAuthObject(0),
            })
            .expect(200)
            .expect('Content-Type', /json/);
    });

    it('should create a user for deletion', () => {
        return request(app)
            .post('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: 'TestDelete',
                [roleField]: 0,
                [passphraseField]: 'abc8XZYz!'
            })
            .expect(201);
    });

    it('should log in as TestDelete', () => {
        return request(app)
        .post('/login')
        .send({
            [accountNameField]: 'TestDelete',
            [passphraseField]: 'abc8XZYz!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
            delToken = 'Bearer ' + response.body.token;
        });
    });

    it('should not create a duplicate reader user', () => {
        return request(app)
            .post('/rest/user')
            .set('Authorization', adminToken)
            .send({
                ...getAuthObject(0),
                [roleField]: 0,
            })
            .expect(400);
    });

    it('should detect that no real update is done', () => {
        return request(app)
            .put('/rest/user')
            .set('Authorization', adminToken)
            .send({
                ...getAuthObject(1),
                [roleField]: 0,
            })
            .expect(304);
    });

    it('should detect that no real update is done with omitted passphrase', () => {
        return request(app)
            .put('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: getAuthObject(1)[accountNameField],
                [roleField]: 0,
            })
            .expect(304);
    });

    it('should update user to editor', () => {
        return request(app)
            .put('/rest/user')
            .set('Authorization', adminToken)
            .send({
                [accountNameField]: getAuthObject(1)[accountNameField],
                [roleField]: 1,
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.role).toBe(1);
            });
    });

    it('should delete a user', () => {
        return request(app)
            .delete('/rest/user/TestDelete/1')
            .set('Authorization', adminToken)
            .expect(200);
    });

    it('should prevent a deleted user from using his token', () => {
        return request(app)
            .get('/rest/user/current')
            .set('Authorization', delToken)
            .expect(401);
    });
});

describe('User without admin role', () => {
    it('should get an authorization token', () => {
        return request(app)
            .post('/login')
            .send(getAuthObject(1))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.username).toBe('testeditor');
                editToken = 'Bearer ' + response.body.token;
            });
    });

    it('should not be allowed to create a user', () => {
        return request(app)
        .post('/rest/user')
        .set('Authorization', editToken)
        .send({
            [accountNameField]: 'TestWithMissingPrivilege',
            [roleField]: 0,
            [passphraseField]: 'abc8XZYz!',
        })
        .expect(403)
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.status).toBe(403);
        });
    });

    it('should not be allowed to update an existing user', () => {
        return request(app)
            .put('/rest/user')
            .set('Authorization', editToken)
            .send({
                [accountNameField]: getAuthObject(0)[accountNameField],
                [roleField]: 1,
            })
            .expect(403)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.status).toBe(403);
            });
    });

    it('should update his passphrase', () => {
        return request(app)
            .patch('/rest/user/passphrase')
            .set('Authorization', editToken)
            .send({
                [passphraseField]: 'TestEdit1#',
            })
            .expect(200);
    });

    it('should be able to login with the new password', () => {
        return request(app)
            .post('/login')
            .send({
                [accountNameField]: getAuthObject(1)[accountNameField],
                [passphraseField]: 'TestEdit1#'
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.username).toBe('testeditor');
                editToken = 'Bearer ' + response.body.token;
            });
    });

    it('should not be allowed to delete a user', () => {
        return request(app)
            .delete('/rest/user/Testreader/1')
            .set('Authorization', editToken)
            .expect(403)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.status).toBe(403);
            });
    });

    it('should read all users', () => {
        return request(app)
            .get('/rest/users')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(3);
            });
    });

    it('should search and not find the editor user by a part of his name because of wrong role', () => {
        return request(app)
            .get('/rest/users/search/TED' )
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(0);
            });
    });

    it('should search and find the reader user by a part of his name', () => {
        return request(app)
            .get('/rest/users/search/TrE' )
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
                expect(response.body[0]).toHaveProperty(accountNameField, getAuthObject(0)[accountNameField].toLocaleLowerCase());
            });
    });

    it('should reset editor users password', () => {
        return request(app)
            .patch('/rest/user/passphrase')
            .set('Authorization', editToken)
            .send({
                [passphraseField]: getAuthObject(1)[passphraseField],
            })
            .expect(200);
    });

    it ('should be able to login editor user after password change', () => {
        return request(app)
            .post('/login')
            .send(getAuthObject(1))
            .expect(200)
            .expect('Content-Type', /json/);
    });
});