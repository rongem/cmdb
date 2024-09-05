import request from 'supertest';
import fs from 'fs';
import { app } from '../../app';
import {
    idField,
    workbookField,
    itemTypeIdField,
    columnsField,
    rowsField,
    targetTypeField,
    targetIdField
} from '../../util/fields.constants';
import { targetTypeValues, deleteValue } from '../../util/values.constants';
import { invalidFileTypeMsg, 
    importIgnoringEmptyNameMsg, 
    importIgnoringDuplicateNameMsg, 
    importItemCreatedMsg, 
    importItemUpdatedMsg, 
    importConnectionUpdatedMsg, 
    importConnectionCreatedMsg, 
    invalidDescriptionMsg, 
    maximumNumberOfConnectionsToLowerExceededMsg, 
    maximumNumberOfConnectionsToUpperExceededMsg
} from '../../util/messages.constants';
import { getAuthObject, validButNotExistingMongoId, notAMongoId } from '../../test/functions';
import { ItemType } from '../../models/meta-data/item-type.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';

let editToken: string, readerToken: string;
let itemTypes: ItemType[], attributeTypes: AttributeType[], rule: ConnectionRule;
let xlsxFile: string, csvFile: string, invalidFormatFile: string;

describe('Importing xlsx and csv files', function() {
    beforeAll(async () => {
        await request(app)
            .post('/login')
            .send(getAuthObject(1))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.username).toBe('testeditor');
                editToken = 'Bearer ' + response.body.token;
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
                itemTypes = response.body.itemTypes;
                attributeTypes = response.body.attributeTypes;
            });
        expect(process.env.TEST_XLSX_FILE).toBeDefined();
        expect(process.env.TEST_CSV_FILE).toBeDefined();
        expect(process.env.TEST_INVALID_FILE).toBeDefined();
        xlsxFile = process.env.TEST_XLSX_FILE!;
        csvFile = process.env.TEST_CSV_FILE!;
        invalidFormatFile = process.env.TEST_INVALID_FILE!;
        expect(fs.existsSync(xlsxFile)).toBeTruthy();
        expect(fs.existsSync(csvFile)).toBeTruthy();
        expect(fs.existsSync(invalidFormatFile)).toBeTruthy();
        await request(app)
            .get('/rest/connectionrules/forupperitemtype/' + itemTypes[3][idField])
            .set('Authorization', readerToken)
            .expect(200)
            .then(response => {
                expect(response.body.length).toBeGreaterThan(0);
                rule = response.body[0];
            });
    });

    it('should get a validation error with an invalid file', async () => {
        return request(app)
            .post('/rest/import/convertfiletotable')
            .set('Authorization', readerToken)
            .attach(workbookField, invalidFormatFile, 'A.xml')
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty('message', invalidFileTypeMsg);
            });
    });

    it('should get content of a xlsx file', async () => {
        return request(app)
            .post('/rest/import/convertfiletotable')
            .set('Authorization', readerToken)
            .attach(workbookField, xlsxFile, 'A.xlsx')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty('sheets');
                expect(response.body.sheets.length).toBeGreaterThan(0);
            });
    });

    it('should get content of a csv file', async () => {
        return request(app)
            .post('/rest/import/convertfiletotable')
            .set('Authorization', readerToken)
            .attach(workbookField, csvFile, 'A.csv')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty('sheets');
                expect(response.body.sheets.length).toBeGreaterThan(0);
            });
    });

    it('should get a validation error without content', () => {
        return request(app)
            .put('/rest/import/datatable')
            .set('Authorization', editToken)
            .send({})
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty('data');
                expect(response.body.data).toHaveProperty('errors');
                expect(response.body.data.errors).toHaveProperty('length', 3);
                const params = response.body.data.errors.map((e: { path: string; }) => e.path);
                expect(params).toContain(itemTypeIdField);
                expect(params).toContain(columnsField);
                expect(params).toContain(rowsField);
            });
    });
    
    it('should get a validation error with empty content', () => {
        return request(app)
            .put('/rest/import/datatable')
            .set('Authorization', editToken)
            .send({
                [itemTypeIdField]: notAMongoId,
                [columnsField]: [],
                [rowsField]: [],
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty('data');
                expect(response.body.data).toHaveProperty('errors');
                expect(response.body.data.errors).toHaveProperty('length', 4);
                const params = response.body.data.errors.map((e: { path: string; }) => e.path);
                expect(params).toContain(itemTypeIdField);
                expect(params).toContain(columnsField);
            });
    });
    
    it('should get a validation error with invalid content', () => {
        return request(app)
            .put('/rest/import/datatable')
            .set('Authorization', editToken)
            .send({
                [itemTypeIdField]: validButNotExistingMongoId,
                [columnsField]: [{
                    [targetTypeField]: true,
                }, {
                    [targetTypeField]: targetTypeValues[5],
                    [targetIdField]: validButNotExistingMongoId,
                }, {
                    [targetTypeField]: targetTypeValues[5],
                    [targetIdField]: notAMongoId,
                }, {
                    [targetTypeField]: targetTypeValues[1],
                    [targetIdField]: notAMongoId,
                }, {
                    [targetTypeField]: targetTypeValues[1],
                    [targetIdField]: validButNotExistingMongoId,
                }, {
                    [targetTypeField]: targetTypeValues[2],
                    [targetIdField]: validButNotExistingMongoId,
                }],
                [rowsField]: [['test', false, 5, '', {}, {test: 'test'}], [], 1, ['', 'test', 'another', 'one', 'bites', 'the', 'dust', 'too much']],
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty('data');
                expect(response.body.data).toHaveProperty('errors');
                expect(response.body.data.errors.length).toBeGreaterThan(9);
                const params = response.body.data.errors.map((e: { path: string; }) => e.path);
                expect(params).toContain(itemTypeIdField);
                expect(params).toContain(columnsField);
                expect(params.filter((p: string) => p === columnsField)).toHaveProperty('length', 4);
                expect(params).toContain(columnsField + '[0]');
                expect(params).toContain(columnsField + '[0].' + targetTypeField);
                expect(params).toContain(columnsField + '[2].' + targetIdField);
                expect(params).toContain(columnsField + '[3].' + targetIdField);
                expect(params).toContain(rowsField + '[0][1]');
                expect(params).toContain(rowsField + '[0][2]');
                expect(params).toContain(rowsField + '[0][4]');
                expect(params).toContain(rowsField + '[0][5]');
                expect(params).toContain(rowsField + '[1]');
                expect(params).toContain(rowsField + '[2]');
                expect(params).toContain(rowsField + '[3]');
            });
    });
    
    it('should not import content as a reader', () => {
        return request(app)
            .put('/rest/import/datatable')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: itemTypes[0][idField],
                [columnsField]: [{
                    [targetTypeField]: targetTypeValues[0],
                    [targetIdField]: undefined,
                }],
                [rowsField]: [['test1'], ['test2']],
            })
            .expect(403);
    });

    it('should import a simple list with one attribute and a link', () => {
        return request(app)
            .put('/rest/import/datatable')
            .set('Authorization', editToken)
            .send({
                [itemTypeIdField]: itemTypes[3][idField],
                [columnsField]: [{
                    [targetTypeField]: targetTypeValues[0],
                }, {
                    [targetTypeField]: targetTypeValues[1],
                    [targetIdField]: attributeTypes[0][idField]
                }, {
                    [targetTypeField]: targetTypeValues[5],
                }],
                [rowsField]: [
                    ['test1', '', 'not a link'],
                    ['test2', '', 'https://angular.io'],
                    ['Rack Server 1', deleteValue, 'https://angular.io'],
                    ['', 'ignored', 'ignored'],
                    ['Rack server hardware 03', 'another value', 'not a link'],
                    ['Rack server hardware 04', '10.11.12.13', ''],
                    ['rack server hardware 04', 'ignored', 'http://www.xxx.yyy.zzz'],
                ],
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                const messages = response.body.map((b: { message: string; }) => b.message);
                expect(messages).toContain(importIgnoringEmptyNameMsg);
                expect(messages).toContain(importIgnoringDuplicateNameMsg);
                expect(messages).toContain(importItemUpdatedMsg);
                expect(messages).toContain(importItemCreatedMsg);
            });
    });
    
    it('should import a simple list with one connection to lower', () => {
        return request(app)
            .put('/rest/import/datatable')
            .set('Authorization', editToken)
            .send({
                [itemTypeIdField]: itemTypes[3][idField],
                [columnsField]: [{
                    [targetTypeField]: targetTypeValues[0],
                }, {
                    [targetTypeField]: targetTypeValues[3],
                    [targetIdField]: rule[idField]
                }],
                [rowsField]: [
                    ['test1', 'Rack 02|xyz|abc'],
                    ['test2', 'Rack 02|'],
                    ['Rack Server 1', 'Rack 01| x Test a1   '],
                    ['Rack server hardware 01', 'Rack 02|xTest a2'],
                    ['Rack server hardware 03', 'another value|xTest a3'],
                    ['Rack server hardware 04', 'Rack 01|xTest a4'],
                    ['Rack server hardware 10', 'Rack 02|xTest a5'],
                    ['Rack server hardware 11', 'Rack 02|xTest a6'],
                    ['Rack server hardware 12', 'Rack 02|xTest a6'],
                    ['Rack server hardware 13', 'Rack 02|xTest a8'],
                ],
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                const messages = response.body.map((b: { message: string; }) => b.message);
                expect(messages).toContain(importConnectionUpdatedMsg);
                expect(messages).toContain(importConnectionCreatedMsg);
                expect(messages).toContain(invalidDescriptionMsg);
                expect(messages).toContain(maximumNumberOfConnectionsToLowerExceededMsg);
                expect(messages).toContain(maximumNumberOfConnectionsToUpperExceededMsg);
            });
    });
    
    it('should import a simple list with one connection to upper', () => {
        return request(app)
            .put('/rest/import/datatable')
            .set('Authorization', editToken)
            .send({
                [itemTypeIdField]: itemTypes[2][idField],
                [columnsField]: [{
                    [targetTypeField]: targetTypeValues[0],
                }, {
                    [targetTypeField]: targetTypeValues[2],
                    [targetIdField]: rule[idField]
                }],
                [rowsField]: [
                    ['Rack 11', 'Rack server hardware 02|xyz|abc'],
                    ['Rack 03', 'Rack server hardware 09'],
                    ['Rack 02', 'Rack server hardware 10|xTest b1'],
                    ['Rack 04', 'Rack server hardware 08|xTest b2'],
                ],
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                const messages = response.body.map((b: { message: string; }) => b.message);
                expect(messages).toContain(importConnectionUpdatedMsg);
                expect(messages).toContain(importConnectionCreatedMsg);
                expect(messages).toContain(importItemCreatedMsg);
                expect(messages).toContain(invalidDescriptionMsg);
                expect(messages).toContain(maximumNumberOfConnectionsToUpperExceededMsg);
            });
    });
});
