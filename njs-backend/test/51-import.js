const { expect } = require('chai');
const {
    idField,
    nameField,
    workbookField,
    itemTypeIdField,
    columnsField,
    rowsField,
    numberField,
    captionField,
    targetTypeField,
    targetIdField,
} = require('../dist/util/fields.constants');
const { targetTypeValues } = require('../dist/util/values.constants');
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
let itemTypes;
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
                    [numberField]: -1,
                    [targetTypeField]: false,
                    [captionField]: '',
                }],
                [rowsField]: [['test'], [], 1, [false], ['']],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('errors');
                expect(res.body.data.errors).to.be.a('array');
                expect(res.body.data.errors).to.have.property('length', 9);
                const params = res.body.data.errors.map(e => e.param);
                expect(params).to.include(itemTypeIdField);
                expect(params).to.include(columnsField);
                expect(params).to.include(columnsField + '[0]');
                expect(params).to.include(columnsField + '[0].' + numberField);
                expect(params).to.include(columnsField + '[0].' + targetTypeField);
                expect(params).to.include(columnsField + '[0].' + captionField);
                expect(params).to.include(rowsField + '[1]');
                expect(params).to.include(rowsField + '[2]');
                expect(params).to.include(rowsField + '[3][0]');
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
                    [numberField]: 1,
                    [targetTypeField]: targetTypeValues[0],
                    [targetIdField]: undefined,
                    [captionField]: 'Test',
                }],
                [rowsField]: [['test'], ['test']],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(403);
                done();
            });
    });
    
});
