const { expect } = require('chai')
const {
    idField,
    itemTypeIdField,
    nameOrValueField,
} = require('../dist/util/fields.constants');
let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getToken, getAuthObject, validButNotExistingMongoId, notAMongoId } = require('./01-functions');

let chai = require('chai');

chai.use(chaihttp);


let readerToken;
let itemTypes, connectionTypes, rule0, rule2;

describe('Configuration items and connections', function() {
    before(function() {
        // adminToken = getToken('admin');
        readerToken = getToken('reader');
        // editToken = getToken('editor');
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
            .get('/rest/connectiontypes')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(1);
                connectionTypes = res.body;
                done();
            });
    });

    it('should not search with no criteria', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(422);
                done();
            });
    })

    it('should search and find items by item type', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [itemTypeIdField]: itemTypes[0][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                if (res.status !== 200) {
                    console.log(res.body.data ?? res.body);
                }
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(1);
                done();
            });
    })

    it('should search and find items by item type', function(done) {
        chai.request(server)
            .search('/rest/configurationitems')
            .set('Authorization', readerToken)
            .send({
                [nameOrValueField]: '2',
                [itemTypeIdField]: itemTypes[0][idField],
            })
            .end((err, res) => {
                expect(err).to.be.null;
                if (res.status !== 200) {
                    console.log(res.body.data ?? res.body);
                }
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.greaterThan(0);
                console.log(res.body);
                done();
            });
    })

});
