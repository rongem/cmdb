import request from 'supertest';
import { app } from '../../app';
import { getAuthObject } from '../../test/functions';
import { accountNameField, attributeGroupsField } from '../../util/fields.constants';

let readerToken: string;

describe('Meta data', function() {
    beforeAll(() => {
        return request(app)
            .post('/login')
            .send(getAuthObject(0))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.username).toBe('testreader');
                readerToken = 'Bearer ' + response.body.token;
            });
    });

    it('should read all meta data', () => {
        return request(app)
            .get('/rest/metadata')
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty('userName', getAuthObject(0)[accountNameField].toLocaleLowerCase());
                expect(response.body).toHaveProperty('userRole', 0);
                expect(response.body[attributeGroupsField]).toHaveLength(4);
                expect(response.body.attributeTypes).toHaveLength(6);
                expect(response.body.connectionTypes).toHaveLength(2);
                expect(response.body.connectionRules).toHaveLength(2);
                expect(response.body.itemTypes).toHaveLength(4);
            });
    });

});
