const { expect } = require('chai');
const {
    idField,
    workbookField,
    itemTypeIdField,
    columnsField,
    rowsField,
    targetTypeField,
    targetIdField,
} = require('../dist/util/fields.constants');
const { targetTypeValues, deleteValue } = require('../dist/util/values.constants');
const {
    invalidFileTypeMsg,
} = require('../dist/util/messages.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getToken, validButNotExistingMongoId, notAMongoId } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let editToken, readerToken;
let itemTypes, attributeTypes;
let xlsxFile, csvFile, invalidFormatFile;

describe('Importing xlsx and csv files', function() {
    before(function() {
        readerToken = getToken('reader');
        editToken = getToken('editor');
        server = serverexp.default()
        xlsxFile = process.env.TEST_XLSX_FILE;
        csvFile = process.env.TEST_CSV_FILE;
        invalidFormatFile = process.env.TEST_INVALID_FILE;
        expect(xlsxFile).to.exist;
        expect(csvFile).to.exist;
        expect(invalidFormatFile).to.exist;
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/itemtypes')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(2);
                itemTypes = res.body;
                done();
            });
    });

    before(function(done) {
        chai.request(server)
            .get('/rest/attributetypes/foritemtype/' + itemTypes[3][idField])
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(0);
                attributeTypes = res.body;
                done();
            });
    });

    it('should get a validation error with an invalid file', function(done) {
        chai.request(server)
            .post('/rest/import/convertfiletotable')
            .set('Authorization', readerToken)
            .attach(workbookField, invalidFormatFile, 'A.xml')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                expect(res.body).to.have.property('message', invalidFileTypeMsg);
                done();
            });
    });

    it('should get content of a xlsx file', function(done) {
        chai.request(server)
            .post('/rest/import/convertfiletotable')
            .set('Authorization', readerToken)
            .attach(workbookField, xlsxFile, 'A.xlsx')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property('sheets');
                expect(res.body.sheets).to.be.a('array');
                expect(res.body.sheets.length).to.be.greaterThan(0);
                done();
            });
    });

    it('should get content of a csv file', function(done) {
        chai.request(server)
            .post('/rest/import/convertfiletotable')
            .set('Authorization', readerToken)
            .attach(workbookField, csvFile, 'A.csv')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property('sheets');
                expect(res.body.sheets).to.be.a('array');
                expect(res.body.sheets.length).to.be.greaterThan(0);
                done();
            });
    });

});

describe('Importing data', function() {
    it('should get a validation error without content', function(done) {
        chai.request(server)
            .put('/rest/import/datatable')
            .set('Authorization', editToken)
            .send({})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('errors');
                expect(res.body.data.errors).to.be.a('array');
                expect(res.body.data.errors).to.have.property('length', 3);
                const params = res.body.data.errors.map(e => e.param);
                expect(params).to.include(itemTypeIdField);
                expect(params).to.include(columnsField);
                expect(params).to.include(rowsField);
                done();
            });
    });
    
    it('should get a validation error with empty content', function(done) {
        chai.request(server)
            .put('/rest/import/datatable')
            .set('Authorization', editToken)
            .send({
                [itemTypeIdField]: notAMongoId,
                [columnsField]: [],
                [rowsField]: [],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('errors');
                expect(res.body.data.errors).to.be.a('array');
                expect(res.body.data.errors).to.have.property('length', 3);
                const params = res.body.data.errors.map(e => e.param);
                expect(params).to.include(itemTypeIdField);
                expect(params).to.include(columnsField);
                expect(params).to.include(rowsField);
                done();
            });
    });
    
    it('should get a validation error with invalid content', function(done) {
        chai.request(server)
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
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('errors');
                expect(res.body.data.errors).to.be.a('array');
                // console.log(res.body.data.errors);
                expect(res.body.data.errors.length).to.be.greaterThan(9);
                const params = res.body.data.errors.map(e => e.param);
                expect(params).to.include(itemTypeIdField);
                expect(params).to.include(columnsField);
                expect(params.filter(p => p === columnsField)).to.have.property('length', 4);
                expect(params).to.include(columnsField + '[0]');
                expect(params).to.include(columnsField + '[0].' + targetTypeField);
                expect(params).to.include(columnsField + '[2].' + targetIdField);
                expect(params).to.include(columnsField + '[3].' + targetIdField);
                expect(params).to.include(rowsField + '[0][1]');
                expect(params).to.include(rowsField + '[0][2]');
                expect(params).to.include(rowsField + '[0][4]');
                expect(params).to.include(rowsField + '[0][5]');
                expect(params).to.include(rowsField + '[1]');
                expect(params).to.include(rowsField + '[2]');
                expect(params).to.include(rowsField + '[3]');
                done();
            });
    });
    
    it('should not import content as a reader', function(done) {
        chai.request(server)
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
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it('should import a simple list with one attribute', function(done) {
        chai.request(server)
            .put('/rest/import/datatable')
            .set('Authorization', editToken)
            .send({
                [itemTypeIdField]: itemTypes[3][idField],
                [columnsField]: [{
                    [targetTypeField]: targetTypeValues[0],
                }, {
                    [targetTypeField]: targetTypeValues[1],
                    [targetIdField]: attributeTypes[0][idField]
                }],
                [rowsField]: [
                    ['test2', ''],
                    ['Rack Server 1', deleteValue],
                    ['', 'ignored'],
                    ['Rack server hardware 04', '10.11.12.13'],
                ],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                if (res.status !== 200) {
                    console.log(res.body.data ?? res.body);
                }
                expect(res.status).to.be.equal(200);
                console.log(res.body);
                done();
            });
    });
    
});
