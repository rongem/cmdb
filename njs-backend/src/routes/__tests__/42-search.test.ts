import request from 'supertest';
import { app } from '../../app';
import { idField,
    itemTypeIdField,
    nameOrValueField,
    changedBeforeField, 
    changedAfterField, 
    attributesField, 
    typeIdField, 
    valueField, 
    responsibleUserField, 
    accountNameField, 
    connectionsToLowerField, 
    connectionsToUpperField, 
    lowerItemTypeIdField, 
    connectionTypeIdField, 
    countField, 
    upperItemTypeIdField, 
    maxLevelsField, 
    searchDirectionField, 
    upperItemIdField, 
    extraSearchField, 
    maxConnectionsToLowerField, 
    maxConnectionsToUpperField, 
    validationExpressionField } from '../../util/fields.constants';
import { getAuthObject, validButNotExistingMongoId, notAMongoId } from '../../test/functions';
import { ItemType } from '../../models/meta-data/item-type.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { ConfigurationItem } from '../../models/item-data/configuration-item.model';
import { ConnectionType } from '../../models/meta-data/connection-type.model';
import { Connection } from '../../models/item-data/connection.model';
import { FullConfigurationItem } from '../../models/item-data/full/full-configuration-item.model';

let readerToken: string, adminToken: string;
let itemTypes: ItemType[], attributeTypes: AttributeType[]
let connectionTypes: ConnectionType[];
let rule: ConnectionRule, deletableRule: ConnectionRule;
let items: ConfigurationItem[];

describe('Search configuration items', function() {
    beforeAll(async () => {
        await request(app)
            .post('/login')
            .send(getAuthObject(2))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.username).toBe('testadmin');
                adminToken = 'Bearer ' + response.body.token;
            });
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
            .get('/rest/metadata')
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.attributeTypes).toHaveLength(6);
                expect(response.body.connectionTypes).toHaveLength(2);
                expect(response.body.itemTypes).toHaveLength(4);
                itemTypes = response.body.itemTypes;
                connectionTypes = response.body.connectionTypes;
                attributeTypes = response.body.attributeTypes;
            });
        await request(app)
            .get('/rest/connectionrules/forupperitemtype/' + itemTypes[2][idField])
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
                rule = response.body[0];
            });
        await request(app)
            .post('/rest/connectionrule')
            .set('Authorization', adminToken)
            .send({
                [upperItemTypeIdField]: itemTypes[3][idField],
                [lowerItemTypeIdField]: itemTypes[1][idField],
                [connectionTypeIdField]: connectionTypes[0][idField],
                [maxConnectionsToLowerField]: 1,
                [maxConnectionsToUpperField]: 5,
                [validationExpressionField]: '^x.*$',
            })
            .expect(201)
            .expect('Content-Type', /json/)
            .then(response => {
                deletableRule = response.body;
            });
    });

    it('should not search with no criteria', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .expect(400);
    });

    it('should search and find items by item type', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: itemTypes[0][idField],
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(1);
            });
    });

    it('should search and find items by item type and date', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [changedAfterField]: new Date(Date.now() - 150000),
                [changedBeforeField]: new Date(Date.now()),
                [itemTypeIdField]: itemTypes[0][idField],
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(0);
            });
    });

    it('should get a validation error when after date is before date', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [changedAfterField]: new Date(Date.now()),
                [changedBeforeField]: new Date(Date.now() - 15000),
                [itemTypeIdField]: itemTypes[0][idField],
            })
            .expect(400);
    });

    it('should get a validation error when a date is invalid', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [changedAfterField]: 'blo',
            })
            .expect(400);
    });

    it('should search and find items by name or attribute value', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [nameOrValueField]: 'Blade',
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(0);
            });
    });

    it('should get a validation error with non-array as attributes value', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [attributesField]: 'Blade',
            })
            .expect(400);
    });

    it('should search and find items by non existing attribute value of type', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [attributesField]: [
                    { [typeIdField]: attributeTypes[0][idField] },
                ],
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(10);
            });
    });

    it('should search and find items by attribute value of type', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [attributesField]: [
                    {
                        [typeIdField]: attributeTypes[1][idField],
                        [valueField]: 'IP val'
                    },
                ],
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
            });
    });

    it('should search and find items by not empty attribute value of type', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [attributesField]: [
                    {
                        [typeIdField]: attributeTypes[1][idField],
                        [valueField]: '!'
                    },
                ],
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
            });
    });

    it('should search and find items by not equal attribute value of type', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [attributesField]: [
                    {
                        [typeIdField]: attributeTypes[1][idField],
                        [valueField]: '!ip'
                    },
                ],
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(0);
            });
    });

    it('should get a validation error for an invalid attribute type', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [attributesField]: [
                    { [typeIdField]: validButNotExistingMongoId },
                ],
            })
            .expect(400);
    });

    it('should get a validation error for an invalid attribute type', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [attributesField]: [
                    { [typeIdField]: notAMongoId },
                ],
            })
            .expect(400);
    });

    it('should search and find items by responsible user', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [responsibleUserField]: getAuthObject(2)[accountNameField],
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
            });
    });

    it('should search and find 0 items by invalid responsible user', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [responsibleUserField]: 'invalidUser',
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(0);
            });
    });

    it('should find items with connections', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: rule[lowerItemTypeIdField],
                [connectionsToUpperField]: [{
                    [connectionTypeIdField]: rule[connectionTypeIdField],
                    [countField]: '1+',
                }],
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(0);
                items = response.body;
            });
    });

    it('should find items with connections and upper item type', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: rule[lowerItemTypeIdField],
                [connectionsToUpperField]: [{
                    [connectionTypeIdField]: rule[connectionTypeIdField],
                    [itemTypeIdField]: rule[upperItemTypeIdField],
                    [countField]: '1+',
                }],
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(1);
            });
    });

    it('should find 0 items for connections with non-existing upper item type', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: rule[lowerItemTypeIdField],
                [connectionsToUpperField]: [{
                    [connectionTypeIdField]: deletableRule[connectionTypeIdField],
                    [itemTypeIdField]: itemTypes[3][idField],
                    [countField]: '1+',
                }],
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(0);
            });
    });

    it('should get a validation error for a not existing item type id', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: rule[lowerItemTypeIdField],
                [connectionsToUpperField]: [{
                    [connectionTypeIdField]: validButNotExistingMongoId,
                    [itemTypeIdField]: validButNotExistingMongoId,
                    [countField]: '1+',
                }],
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.data.errors).toHaveLength(2);
            });
    });

    it('should get a validation error for an invalid item type id', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: rule[lowerItemTypeIdField],
                [connectionsToUpperField]: [{
                    [connectionTypeIdField]: notAMongoId,
                    [itemTypeIdField]: notAMongoId,
                    [countField]: '1+',
                }],
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.data.errors).toHaveLength(2);
            });
    });

    it('should get an error for invalid connection arrays and missing search criteria and item type', () => {
        return request(app)
            .post('/rest/configurationitems/search')
            .set('Authorization', readerToken)
            .send({
                [connectionsToLowerField]: 'invalidArray',
                [connectionsToUpperField]: 'invalidArray',
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.data.errors).toHaveLength(4);
            });
    });

    it('should search and find full items by item type', () => {
        return request(app)
            .post('/rest/configurationitems/full/search')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: itemTypes[2][idField],
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                const itemsWithConnections = response.body.filter((item: FullConfigurationItem) =>
                    item[connectionsToLowerField]!.length > 0 || item[connectionsToUpperField]!.length > 0);
                expect(itemsWithConnections.length).toBeGreaterThan(4);
            });
    });

    afterAll(async () => {
        return request(app)
            .delete('/rest/connectionrule/' + deletableRule[idField])
            .set('Authorization', adminToken)
            .expect(200);
    })

});

let itemsCount: number;
let itemIds: string[] = [];

describe('Search config items neighbors', function() {
    beforeAll(async () => {
        return request(app)
            .get('/rest/configurationitem/' + items[0][idField] + '/connections/toUpper')
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                itemsCount = response.body.length;
                response.body.forEach((c: Connection) => itemIds.push(c[upperItemIdField]));
            });
    });

    it('should search and find all directly attached items', () => {
        return request(app)
            .post('/rest/configurationitem/' + items[0][idField] + '/search')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: itemTypes[2][idField],
                [maxLevelsField]: 1,
                [searchDirectionField]: 'up'
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(itemsCount);
                for (let i = 0; i < response.body.length; i++) {
                    expect(itemIds).toContain(response.body[i][idField]);
                    expect(response.body[i].level).toBe(1);
                }
            });
    });

    it('should search and find all directly attached items with name or value', () => {
        return request(app)
            .post('/rest/configurationitem/' + items[0][idField] + '/search')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: itemTypes[2][idField],
                [maxLevelsField]: 1,
                [searchDirectionField]: 'up',
                [extraSearchField]: {
                    [nameOrValueField]: '0',
                }
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(itemsCount - 1);
            });
    });

    it('should get a validation error with a deviating item type in extraSearch', () => {
        return request(app)
            .post('/rest/configurationitem/' + items[0][idField] + '/search')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: itemTypes[2][idField],
                [maxLevelsField]: 1,
                [searchDirectionField]: 'up',
                [extraSearchField]: {
                    [nameOrValueField]: 'Test',
                    [itemTypeIdField]: itemTypes[1][idField],
                }
            })
            .expect(400);
    });

    it('should get validation errors for wrong fields', () => {
        return request(app)
            .post('/rest/configurationitem/' + items[0][idField] + '/search')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: validButNotExistingMongoId,
                [maxLevelsField]: -1,
                [searchDirectionField]: 'xyz',
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.data.errors).toHaveLength(3);
            });
    });

    it('should get validation errors for missing fields', () => {
        return request(app)
            .post('/rest/configurationitem/' + items[0][idField] + '/search')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: notAMongoId,
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.data.errors).toHaveLength(3);
            });
    });

})
