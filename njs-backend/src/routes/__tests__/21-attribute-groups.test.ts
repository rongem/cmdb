import request from 'supertest';
import { app } from '../../app';
import { getAuthObject } from '../../test/functions';
import { AttributeGroup } from '../../models/meta-data/attribute-group.model';
import { nameField } from '../../util/fields.constants';

let editToken: string;
let attributeGroup: AttributeGroup
const networkAttributesName = 'Network attributes';

describe('Attribute groups', () => {
    beforeAll(() => {
        return request(app)
            .post('/login')
            .send(getAuthObject(1))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                editToken = 'Bearer ' + response.body.token;
                expect(response.body.username).toBe('testeditor');
            });
    });

    it('should retrieve all attribute groups', () => {
        return request(app)
            .get('/rest/AttributeGroups')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                attributeGroup = response.body;
            })
    });

    it('should not be allowed to create an attribute group as editor', () => {
        return request(app)
            .post('/rest/AttributeGroup')
            .set('Authorization', editToken)
            .send({
                [nameField]: networkAttributesName
            })
            .expect(403);
    });

    it('should not update an attribute group as an editor', () => {
        return request(app)
            .put('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', editToken)
            .send({
                ...attributeGroup,
                [nameField]: 'Test name'
            })
            .expect(403);
    });

    it('should not be able to delete the attribute group as editor', () => {
        return request(app)
            .delete('/rest/AttributeGroup/' + attributeGroup.id)
            .set('Authorization', editToken)
            .expect(403);
    });

    it('should read all attribute groups and retrieve 4 in a sorted order', () => {
        return request(app)
            .get('/rest/AttributeGroups')
            .set('Authorization', editToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(4);
                expect(response.body[0][nameField] < response.body[1][nameField]).toBeTruthy();
                expect(response.body[1][nameField] < response.body[2][nameField]).toBeTruthy();
                expect(response.body[2][nameField] < response.body[3][nameField]).toBeTruthy();
            });
    });



});