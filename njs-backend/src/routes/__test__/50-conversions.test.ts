import request from 'supertest';
import { app } from '../../app';
import {
    idField,
    nameField,
    newItemTypeNameField,
    positionField,
    colorField,
    connectionTypeIdField,
    attributeTypesToTransferField,
} from '../../util/fields.constants';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { ConnectionType } from '../../models/meta-data/connection-type.model';

import { belowValue } from '../../util/values.constants';
import { getAuthObject, validButNotExistingMongoId, notAMongoId } from '../../test/functions';

let adminToken: string, readerToken: string;
let connectionTypes: ConnectionType[];
let attributeTypes: AttributeType[], attributeTypeToConvert: AttributeType, accompanyingType: AttributeType;

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
                connectionTypes = response.body.connectionTypes;
                attributeTypes = response.body.attributeTypes;
                attributeTypeToConvert = attributeTypes.find(a => a[nameField] === 'Model')!;
            });
    });

    it('should get a validation error with a non existing attribute type', () => {
        return request(app)
            .get('/rest/attributetype/' + validButNotExistingMongoId + '/correspondingvaluesoftype')
            .set('Authorization', readerToken)
            .expect(400);
    });

    it('should get a validation error with an invalid id', () => {
        return request(app)
            .get('/rest/attributetype/' + notAMongoId + '/correspondingvaluesoftype')
            .set('Authorization', readerToken)
            .expect(400);
    });

    it('should get 3 attribute types that have equal attributes', () => {
        return request(app)
            .get('/rest/attributetype/' + attributeTypeToConvert[idField] + '/correspondingvaluesoftype')
            .set('Authorization', readerToken)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveLength(3);
                accompanyingType = response.body.find((a: AttributeType) => a[nameField] === 'Status');
            });
    });

    it('should get validation errors with wrong parameters for conversion', () => {
        return request(app)
            .post('/rest/attributetype/' + notAMongoId + '/converttoitemtype')
            .set('Authorization', adminToken)
            .send({
                [newItemTypeNameField]: '',
                [positionField]: 'x',
                [colorField]: 'noColor',
                [connectionTypeIdField]: validButNotExistingMongoId,
                [attributeTypesToTransferField]: [
                    validButNotExistingMongoId,
                    notAMongoId,
                ]
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.data.errors).toHaveLength(6);
            });
    });

    it('should get validation errors with wrong parameters for conversion, second set', () => {
        return request(app)
            .post('/rest/attributetype/' + attributeTypeToConvert[idField] + '/converttoitemtype')
            .set('Authorization', adminToken)
            .send({
                [newItemTypeNameField]: '',
                [connectionTypeIdField]: notAMongoId,
                [attributeTypesToTransferField]: [
                    validButNotExistingMongoId,
                    accompanyingType[idField],
                ]
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.data.errors).toHaveLength(4);
            });
    });

    it('should not convert attribute type to item type as reader', () => {
        return request(app)
            .post('/rest/attributetype/' + attributeTypeToConvert[idField] + '/converttoitemtype')
            .set('Authorization', readerToken)
            .send({
                [newItemTypeNameField]: '',
                [positionField]: belowValue,
                [colorField]: '#FFFFFF',
                [connectionTypeIdField]: connectionTypes[0][idField],
                [attributeTypesToTransferField]: [
                    accompanyingType[idField]
                ]
            })
            .expect(403);
    });

    it('should convert attribute type to item type', () => {
        return request(app)
            .post('/rest/attributetype/' + attributeTypeToConvert[idField] + '/converttoitemtype')
            .set('Authorization', adminToken)
            .send({
                [newItemTypeNameField]: '',
                [positionField]: belowValue,
                [colorField]: '#FFFFFF',
                [connectionTypeIdField]: connectionTypes[0][idField],
                [attributeTypesToTransferField]: [
                    accompanyingType[idField]
                ]
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty('itemType');
                expect(response.body.itemType).toHaveProperty('id');
                expect(response.body).toHaveProperty('items');
                expect(response.body).toHaveProperty('connections');
                expect(response.body).toHaveProperty('deletedAttributeType');
                expect(response.body.deletedAttributeType).toHaveProperty('id', attributeTypeToConvert[idField]);
            });
    });
});
