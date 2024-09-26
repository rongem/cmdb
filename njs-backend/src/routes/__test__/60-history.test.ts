import request from 'supertest';
import { app } from '../../app';
import { idField, nameField } from '../../util/fields.constants';
import { getAuthObject, validButNotExistingMongoId, notAMongoId } from '../../test/functions';
import { ItemType } from '../../models/meta-data/item-type.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';

let readerToken: string;
let itemTypes: ItemType[], item: ConfigurationItem;

describe('Reading historic data for configuration item', function() {
    beforeAll(async () => {
        await request(app)
            .post('/login')
            .send(getAuthObject(0))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.username).toBe('testreader');
                readerToken = 'Bearer ' + response.body.token;
            });
        await request(app)
            .get('/rest/itemtypes')
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(2);
                itemTypes = response.body;
            });
        await request(app)
            .get('/rest/configurationitems/bytypes/' + itemTypes[2][idField])
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(2);
                item = response.body[0];
            });
    })

    it('should get a validation error for an invalid item id', async () => {
        return request(app)
            .get('/rest/configurationitem/' + notAMongoId + '/history')
            .set('Authorization', readerToken)
            .expect(400);
    });

    it('should get an error for a non existing item id', async () => {
        return request(app)
            .get('/rest/configurationitem/' + validButNotExistingMongoId + '/history')
            .set('Authorization', readerToken)
            .expect(404);
    });

    it('should read item history', async () => {
        return request(app)
            .get('/rest/configurationitem/' + item[idField] + '/history')
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty('item');
                expect(response.body).toHaveProperty('connectionsToUpper');
                expect(response.body).toHaveProperty('connectionsToLower');
                expect(response.body.item).toBeDefined();
                expect(response.body.item).toHaveProperty('id', item[idField]);
                expect(response.body.item).toHaveProperty('type', itemTypes[2][nameField]);
                expect(response.body.connectionsToUpper.length).toBeGreaterThan(0);
                expect(response.body.connectionsToUpper[0].descriptions).toBeDefined();
                expect(response.body.connectionsToLower).toBeDefined();
            });
    });
});
