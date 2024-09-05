import request from 'supertest';
import { app } from '../../app';
import { nameField, attributeGroupIdField, idField, validationExpressionField } from '../../util/fields.constants';
import { getAuthObject, validButNotExistingMongoId, notAMongoId } from '../../test/functions';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { AttributeGroup } from '../../models/meta-data/attribute-group.model';

let adminToken: string, editToken: string;
let attributeGroups: AttributeGroup[];
let attributeType: AttributeType;
const ipAddressName = 'IP address';

const testSuccessfulCreatingAttribute = (name: string, group: string, validationExpression: string = '^.*$') => {
    return request(app)
        .post('/rest/attributetype')
        .set('Authorization', adminToken)
        .send({
            [nameField]: name,
            [attributeGroupIdField]: group,
            [validationExpressionField]: validationExpression,
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .then(response => {
            expect(response.body).toHaveProperty(nameField, name);
            expect(response.body).toHaveProperty(attributeGroupIdField, group);
            expect(response.body).toHaveProperty(validationExpressionField, validationExpression);
            attributeType = response.body
    });
}

describe('Attribute types', function() {
    beforeAll(async () => {
        // login as admin and store token
        await request(app)
            .post('/login')
            .send(getAuthObject(2))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.token).toBeDefined();
                adminToken = 'Bearer ' + response.body.token;
                expect(response.body.username).toBe('testadmin');
            });
        await request(app)
            .post('/login')
            .send(getAuthObject(1))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                editToken = 'Bearer ' + response.body.token;
                expect(response.body.username).toBe('testeditor');
            });
    });

    it('should retrieve attribute groups', () => {
        return request(app)
            .get('/rest/AttributeGroups')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(1);
                attributeGroups = response.body;
            });
    });

    it('should create an ip address attribute type', () => {
        return testSuccessfulCreatingAttribute(ipAddressName, attributeGroups[1][idField]);
    });

    it('should get the created attribute type', () => {
        return request(app)
            .get('/rest/attributetype/' + attributeType[idField])
            .set('Authorization', adminToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body[nameField]).toBe(ipAddressName);
            })
    });

    it('should get an error reading a non existing attribute type', () => {
        return request(app)
            .get('/rest/attributetype/' + validButNotExistingMongoId)
            .set('Authorization', adminToken)
            .expect(404);
    });

    it('should get a validation error reading an attribute type with an invalid id', () => {
        return request(app)
            .get('/rest/attributetype/' + notAMongoId)
            .set('Authorization', adminToken)
            .expect(400);
    });

    it('should not create a second ip address attribute type', () => {
        return request(app)
            .post('/rest/attributetype')
            .set('Authorization', adminToken)
            .send({
                [nameField]: ipAddressName,
                [attributeGroupIdField]: attributeGroups[1][idField],
                [validationExpressionField]: '^.*$',
            })
            .expect(400);
    });

    it('should not create an attribute type with an invalid attribute group', () => {
        return request(app)
            .post('/rest/attributetype')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'test',
                [attributeGroupIdField]: validButNotExistingMongoId,
                [validationExpressionField]: '^.*$',
            })
            .expect(400);
    });

    it('should not create an attribute type with an invalid regex', () => {
        return request(app)
            .post('/rest/attributetype')
            .set('Authorization', adminToken)
            .send({
                [nameField]: 'test',
                [attributeGroupIdField]: attributeGroups[1][idField],
                [validationExpressionField]: 'xx',
            })
            .expect(400);
    });

    it('should not create an attribute type as editor', () => {
        return request(app)
            .post('/rest/attributetype')
            .set('Authorization', editToken)
            .send({
                [nameField]: 'test',
                [attributeGroupIdField]: attributeGroups[1][idField],
                [validationExpressionField]: '^.*$',
            })
            .expect(403);
    });

    it('should create a serial attribute', () => {
        return testSuccessfulCreatingAttribute('Serial', attributeGroups[1][idField]);
    });

    it('should not update an attribute type as editor', () => {
        return request(app)
            .put('/rest/attributetype/' + attributeType[idField])
            .set('Authorization', editToken)
            .send({
                ...attributeType,
                [nameField]: 'Serial number',
            })
            .expect(403);
    });

    it('should not update an attribute type to a duplicate name', () => {
        return request(app)
            .put('/rest/attributetype/' + attributeType[idField])
            .set('Authorization', adminToken)
            .send({
                ...attributeType,
                [nameField]: ipAddressName,
            })
            .expect(400);
    });

    it('should detect an update with no changes', () => {
        return request(app)
            .put('/rest/attributetype/' + attributeType[idField])
            .set('Authorization', adminToken)
            .send({
                ...attributeType,
            })
            .expect(304);
    });

    it('should update an attribute type', () => {
        return request(app)
            .put('/rest/attributetype/' + attributeType[idField])
            .set('Authorization', adminToken)
            .send({
                ...attributeType,
                [nameField]: 'Serial number',
                [attributeGroupIdField]: attributeGroups[0][idField],
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty(nameField, 'Serial number');
                expect(response.body).toHaveProperty(attributeGroupIdField, attributeGroups[0][idField]);
            });
    });

    it('should create a manufacturer attribute', () => {
        return testSuccessfulCreatingAttribute('Manufacturer', attributeGroups[0][idField]);
    });

    it('should create a model attribute', () => {
        return testSuccessfulCreatingAttribute('Model', attributeGroups[0][idField]);
    });

    it('should create a waste attribute', () => {
        return testSuccessfulCreatingAttribute('Waste', attributeGroups[0][idField]);
    });

    it('should not be allowed to delete an attribute type as editor', () => {
        return request(app)
            .delete('/rest/attributetype/' + attributeType[idField])
            .set('Authorization', editToken)
            .expect(403);
    });

    it('should delete an attribute type', () => {
        return request(app)
            .delete('/rest/attributetype/' + attributeType[idField])
            .set('Authorization', adminToken)
            .expect(200)
            .expect('Content-Type', /json/);
    });

    it('should retrieve 3 attribute types for the first group in a sorted order', () => {
        return request(app)
            .get('/rest/attributetypes/forgroup/' + attributeGroups[0][idField])
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(3);
                expect(response.body[0][nameField] < response.body[1][nameField]);
                expect(response.body[1][nameField] < response.body[2][nameField]);
            });
    });

    it('should create a status attribute', () => {
        return testSuccessfulCreatingAttribute('Status', attributeGroups[3][idField]);
    });

    it('should create a CPU count attribute', () => {
        return testSuccessfulCreatingAttribute('CPU Count', attributeGroups[2][idField]);
    });

    it('should mark an attribute group with attribute types as not deletable', () => {
        return request(app)
            .get('/rest/attributegroup/' + attributeGroups[0][idField] + '/candelete')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toBe(false);
            });
    });

    it('should not delete an attribute group with attribute types', () => {
        return request(app)
            .delete('/rest/attributegroup/' + attributeGroups[0][idField])
            .set('Authorization', adminToken)
            .expect(400);
    })

});