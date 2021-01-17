const { expect } = require('chai')

let chaihttp = require('chai-http');
let serverexp = require('../dist/app');
let server;
const { getToken, getAuthObject } = require('./01-functions');

let chai = require('chai');
const { accountNameField, attributeGroupsField } = require('../dist/util/fields.constants');

chai.use(chaihttp);


let readerToken;

describe('Meta data', function() {
    before(function() {
        readerToken = getToken('reader');
        server = serverexp.default()
    });

    it('should read all meta data', function(done) {
        chai.request(server)
            .get('/rest/metadata')
            .set('Authorization', readerToken)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property('userName', getAuthObject(0)[accountNameField].toLocaleLowerCase());
                expect(res.body).to.have.property('userRole', 0);
                expect(res.body[attributeGroupsField]).to.be.a('array');
                expect(res.body[attributeGroupsField]).to.have.property('length', 4);
                expect(res.body.attributeTypes).to.be.a('array');
                expect(res.body.attributeTypes).to.have.property('length', 6);
                expect(res.body.connectionTypes).to.be.a('array');
                expect(res.body.connectionTypes).to.have.property('length', 2);
                expect(res.body.connectionRules).to.be.a('array');
                expect(res.body.connectionRules).to.have.property('length', 2);
                expect(res.body.itemTypes).to.be.a('array');
                expect(res.body.itemTypes).to.have.property('length', 4);
                expect(res.body.itemTypeAttributeGroupMappings).to.be.a('array');
                expect(res.body.itemTypeAttributeGroupMappings).to.have.property('length', 4);
                done();
            });
    });

});
