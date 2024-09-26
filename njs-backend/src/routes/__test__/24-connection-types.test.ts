import request from 'supertest';
import { app } from '../../app';
import { nameField, reverseNameField, idField } from '../../util/fields.constants';
import { getAuthObject, validButNotExistingMongoId, notAMongoId } from '../../test/functions';
import { ConnectionType } from '../../models/meta-data/connection-type.model';

let adminToken: string, editToken: string;
let connectionType: ConnectionType;
const forwardName = 'is built into';
const reverseName = 'contains'
const secondForwardName = 'runs in';
const secondReverseName = 'provides';


describe('Connection types', function() {
    beforeAll(async () => {
        // login as admin and store token
        await request(app)
            .post('/login')
            .send(getAuthObject(2))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.token).toBeDefined();
                expect(response.body.username).toBe('testadmin');
                adminToken = 'Bearer ' + response.body.token;
            });
        await request(app)
            .post('/login')
            .send(getAuthObject(1))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.username).toBe('testeditor');
                editToken = 'Bearer ' + response.body.token;
            });
    });


    it('should create a connection type', () => {
        return request(app)
            .post('/rest/ConnectionType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: forwardName,
                [reverseNameField]: reverseName
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(nameField, forwardName);
                expect(response.body).toHaveProperty(reverseNameField, reverseName);
                connectionType = response.body;
            });
    });

    it('should read the connection type', () => {
        return request(app)
            .get('/rest/ConnectionType/' + connectionType[idField])
            .set('Authorization', adminToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(nameField, forwardName);
                expect(response.body).toHaveProperty(reverseNameField, reverseName);
            });
    });

    it('should not read a non existing connection type', () => {
        return request(app)
            .get('/rest/ConnectionType/' + validButNotExistingMongoId)
            .set('Authorization', adminToken)
            .expect(404);
    });

    it('should get a validation error reading a connection type with an invalid id', () => {
        return request(app)
            .get('/rest/ConnectionType/' + notAMongoId)
            .set('Authorization', adminToken)
            .expect(400);
    });

    it('should mark a connection type without rules as deletable', () => {
        return request(app)
            .get('/rest/connectionType/' + connectionType[idField] + '/candelete')
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body).toBe(true);
            });
    });

    it('should not create a connection type of the same name and reverse name', () => {
        return request(app)
            .post('/rest/ConnectionType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: forwardName,
                [reverseNameField]: reverseName
            })
            .expect(400);
    });

    it('should not create a connection type without name', () => {
        return request(app)
            .post('/rest/ConnectionType')
            .set('Authorization', adminToken)
            .send({
                [reverseNameField]: reverseName
            })
            .expect(400);
    });

    it('should not create a connection type without reverse name', () => {
        return request(app)
            .post('/rest/ConnectionType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: forwardName,
            })
            .expect(400);
    });

    it('should not be allowed to create a connection type as editor', () => {
        return request(app)
            .post('/rest/ConnectionType')
            .set('Authorization', editToken)
            .send({
                [nameField]: secondForwardName,
                [reverseNameField]: secondReverseName,
            })
            .expect(403);
    });

    let connectionType: ConnectionType;

    it('should create another connection type', () => {
        return request(app)
            .post('/rest/ConnectionType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Connection Type 2',
                [reverseNameField]: secondReverseName,
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                connectionType = response.body;
            });
    });

    it('should detect an update with no changes', () => {
        return request(app)
            .put('/rest/ConnectionType/' + connectionType[idField])
            .set('Authorization', adminToken)
            .send({
                ...connectionType,
            })
            .expect(304);
    });

    it('should update a connection type', () => {
        return request(app)
            .put('/rest/ConnectionType/' + connectionType[idField])
            .set('Authorization', adminToken)
            .send({
                ...connectionType,
                [nameField]: secondForwardName
            })
            .expect(200);
    });

    it('should not update an connection type to a duplicate name couple', () => {
        return request(app)
            .put('/rest/ConnectionType/' + connectionType[idField])
            .set('Authorization', adminToken)
            .send({
                ...connectionType,
                [nameField]: forwardName,
                [reverseNameField]: reverseName,
            })
            .expect(400);
    });

    it('should detect a difference between ids', () => {
        return request(app)
            .put('/rest/ConnectionType/' + connectionType[idField])
            .set('Authorization', adminToken)
            .send({
                ...connectionType,
                [idField]: validButNotExistingMongoId,
                [nameField]: forwardName
            })
            .expect(400);
    });

    it('should not update a connection type as an editor', () => {
        return request(app)
            .put('/rest/ConnectionType/' + connectionType[idField])
            .set('Authorization', editToken)
            .send({
                ...connectionType,
                [nameField]: 'Test name'
            })
            .expect(403);
    });

    it('should create another connection type', () => {
        return request(app)
            .post('/rest/ConnectionType')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Test Connection type',
                [reverseNameField]: 'Will be deleted'
            })
            .expect(201)
            .then(response => {
                connectionType = response.body;
            });
    });

    it('should read the connection type', () => {
        return request(app)
            .get('/rest/ConnectionType/' + connectionType[idField])
            .set('Authorization', adminToken)
            .expect(200)
            .then(response => {
                expect(response.body.id).toBe(connectionType[idField]);
                expect(response.body.name).toBe(connectionType[nameField]);
            });
    });

    it('should not be able to delete the connection type as editor', () => {
        return request(app)
            .delete('/rest/ConnectionType/' + connectionType[idField])
            .set('Authorization', editToken)
            .expect(403);
    });

    it('should not delete a non existing connection type', () => {
        return request(app)
            .delete('/rest/ConnectionType/' + validButNotExistingMongoId)
            .set('Authorization', adminToken)
            .expect(404);
    });

    it('should get a validation error deleting an invalid id', () => {
        return request(app)
            .delete('/rest/ConnectionType/' + notAMongoId)
            .set('Authorization', adminToken)
            .expect(400);
    });

    it('should delete the connection type', () => {
        return request(app)
            .delete('/rest/ConnectionType/' + connectionType[idField])
            .set('Authorization', adminToken)
            .expect(200);
    });

    it('should read all connection types and retrieve 2', () => {
        return request(app)
            .get('/rest/ConnectionTypes')
            .set('Authorization', editToken)
            .expect(200)
            .then(response => {
                expect(response.body).toHaveLength(2);
            });
    });

});
