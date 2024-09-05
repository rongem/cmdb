import request from 'supertest';
import { app } from '../../app';
import { nameField, idField } from '../../util/fields.constants';
import { validButNotExistingMongoId, notAMongoId, getAuthObject } from '../../test/functions';
import { AttributeGroup } from '../../models/meta-data/attribute-group.model';

let adminToken: string;
const hardwareAttributesName = 'Hardware attributes';
const networkAttributesName = 'Network attributes';

describe('Attribute groups', () => {
    beforeAll(() => {
        // login as admin and store token
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

    it('should create an attribute group', () => {
        return request(app)
            .post('/rest/AttributeGroup')
            .set('Authorization', adminToken)
            .send({
                [nameField]: hardwareAttributesName
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(nameField, hardwareAttributesName);
            });
    });

    it('should not create an attribute group of the same name', () => {
        return request(app)
            .post('/rest/AttributeGroup')
            .set('Authorization', adminToken)
            .send({
                [nameField]: hardwareAttributesName
            })
            .expect(400);
    });

    let attributeGroup: AttributeGroup;

    it('should create an attribute group', () => {
        return request(app)
            .post('/rest/AttributeGroup')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Attribute Group 2'
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                attributeGroup = response.body;
            });
    });

    it('should detect an update with no changes', () => {
        return request(app)
            .put('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', adminToken)
            .send({
                ...attributeGroup,
            })
            .expect(304);
    });

    it('should update an attribute group', () => {
        return request(app)
            .put('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', adminToken)
            .send({
                ...attributeGroup,
                [nameField]: networkAttributesName
            })
            .expect(200)
            .expect('Content-Type', /json/);
    });

    it('should not update an attribute group to a duplicate name', () => {
        return request(app)
            .put('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', adminToken)
            .send({
                ...attributeGroup,
                [nameField]: hardwareAttributesName
            })
            .expect(400);
    });

    it('should detect a difference between ids', () => {
        return request(app)
            .put('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', adminToken)
            .send({
                ...attributeGroup,
                [idField]: validButNotExistingMongoId,
                [nameField]: hardwareAttributesName
            })
            .expect(400);
    });

    it('should create another attribute group', () => {
        return request(app)
            .post('/rest/AttributeGroup')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Test Attribute group'
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                attributeGroup = response.body;
            });
    });

    it('should read the attribute group', () => {
        return request(app)
            .get('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', adminToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.id).toBe(attributeGroup.id);
                expect(response.body.name).toBe(attributeGroup.name);
            });
    });

    it('should get an error reading a non existing attribute group', () => {
        return request(app)
            .get('/rest/AttributeGroup/' + validButNotExistingMongoId)
            .set('Authorization', adminToken)
            .expect(404);
    });

    it('should get a validation error reading an attribute group with an invalid id', () => {
        return request(app)
            .get('/rest/AttributeGroup/' + notAMongoId)
            .set('Authorization', adminToken)
            .expect(400);
    });

    it('should delete the attribute group', () => {
        return request(app)
            .delete('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', adminToken)
            .expect(200);
    });

    it('should create another attribute group', () => {
        return request(app)
            .post('/rest/AttributeGroup')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Status attributes'
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                attributeGroup = response.body;
            });
    });

    it('should create another attribute group', () => {
        return request(app)
            .post('/rest/AttributeGroup')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'Server attributes'
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                attributeGroup = response.body;
            });
    });

    it('should mark attribute group without attribute types as deletable', () => {
        return request(app)
            .get('/rest/attributegroup/' + attributeGroup[idField] + '/candelete')
            .set('Authorization', adminToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toBe(true);
            });
    });

});
