const { expect } = require('chai');
const {
    idField,
    nameField,
    newItemTypeNameField,
    positionField,
    colorField,
    connectionTypeIdField,
    attributeTypesToTransferField,
    workbookField,
} = require('../dist/util/fields.constants');
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
let connectionTypes, attributeTypes, attributeTypeToConvert, accompanyingType;
let xlsxFile, csvFile, invalidFile;

describe('Importing', function() {
    before(function() {
        readerToken = getToken('reader');
        editToken = getToken('editor');
        server = serverexp.default()
        xlsxFile = process.env.TEST_XLSX_FILE;
        csvFile = process.env.TEST_CSV_FILE;
        invalidFile = process.env.TEST_INVALID_FILE;
        expect(xlsxFile).to.exist;
        expect(csvFile).to.exist;
        expect(invalidFile).to.exist;
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
            .attach(workbookField, invalidFile, 'A.xml')
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
                console.log(res.body);
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
