const { expect } = require('chai');
const { idField, nameField } = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getToken, validButNotExistingMongoId, notAMongoId } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);

let readerToken;
let itemTypes, item;

describe('Reading historic data for configuration item', function() {
    before(function() {
        readerToken = getToken('reader');
        server = serverexp.default()
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
            .get('/rest/configurationitems/bytypes/' + itemTypes[2][idField])
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(2);
                item = res.body[0];
                done();
            });
    })

    it('should get a validation error for an invalid item id', function(done) {
        chai.request(server)
            .get('/rest/configurationitem/' + notAMongoId + '/history')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    });

    it('should get an error for a non existing item id', function(done) {
        chai.request(server)
            .get('/rest/configurationitem/' + validButNotExistingMongoId + '/history')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(404);
                done();
            });
    });

    it('should read item history', function(done) {
        chai.request(server)
            .get('/rest/configurationitem/' + item[idField] + '/history')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('item');
                expect(res.body).to.have.property('connectionsToUpper');
                expect(res.body).to.have.property('connectionsToLower');
                expect(res.body.item).to.be.a('object');
                expect(res.body.item).to.have.property('id', item[idField]);
                expect(res.body.item).to.have.property('type', itemTypes[2][nameField]);
                expect(res.body.connectionsToUpper).to.be.a('array');
                expect(res.body.connectionsToUpper.length).to.be.greaterThan(0);
                expect(res.body.connectionsToUpper[0].descriptions).to.be.a('array');
                expect(res.body.connectionsToLower).to.be.a('array');
                done();
            });
    });
});
