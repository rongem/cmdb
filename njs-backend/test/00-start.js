const { expect } = require('chai');
const path = require('path');
require('dotenv').config({path: path.resolve('./test/.env')});

const mongoose = require('mongoose');
const { userModel } = require('../dist/models/mongoose/user.model');
const { attributeGroupModel } = require('../dist/models/mongoose/attribute-group.model');
const { attributeTypeModel } = require('../dist/models/mongoose/attribute-type.model');
const { connectionTypeModel } = require('../dist/models/mongoose/connection-type.model');
const { connectionRuleModel } = require('../dist/models/mongoose/connection-rule.model');
const { itemTypeModel } = require('../dist/models/mongoose/item-type.model');
const { configurationItemModel } = require('../dist/models/mongoose/configuration-item.model');
const { connectionModel } = require('../dist/models/mongoose/connection.model');
const { historicCiModel } = require('../dist/models/mongoose/historic-ci.model');
const { historicConnectionModel } = require('../dist/models/mongoose/historic-connection.model');

describe('Prerequisites', function() {
    before(function() {
        expect(process.env.TEST_MONGODB_URI, 'missing dburi. Check TEST_MONGODB_URI in .env').not.to.be.null;
    });
    
    it('should contain a valid database connection', function() {
        expect(mongoose.connections.length).to.be.greaterThan(0);
    });

    it('should delete connection history', function(done) {
        historicConnectionModel.deleteMany({}).then(res => {
            expect(res.ok).to.be.equal(1);
            done();
        });
    })

    it('should delete configuration item history', function(done) {
        historicCiModel.deleteMany({}).then(res => {
            expect(res.ok).to.be.equal(1);
            done();
        });
    })

    it('should delete all existing connections', function(done) {
        connectionModel.deleteMany({}).then((res) => {
            expect(res.ok).to.be.equal(1);
            done();
        });
    });
    it('should delete all existing configuration items', function(done) {
        configurationItemModel.deleteMany({}).then((res) => {
            expect(res.ok).to.be.equal(1);
            done();
        });
    });
    it('should delete all existing connection rules', function(done) {
        connectionRuleModel.deleteMany({}).then((res) => {
            expect(res.ok).to.be.equal(1);
            done();
        });
    });
    it('should delete all existing item types', function(done) {
        itemTypeModel.deleteMany({}).then((res) => {
            expect(res.ok).to.be.equal(1);
            done();
        });
    });
    it('should delete all existing connection types', function(done) {
        connectionTypeModel.deleteMany({}).then((res) => {
            expect(res.ok).to.be.equal(1);
            done();
        });
    });
    it('should delete all existing attribute types', function(done) {
        attributeTypeModel.deleteMany({}).then((res) => {
            expect(res.ok).to.be.equal(1);
            done();
        });
    });
    it('should delete all existing attribute groups', function(done) {
        attributeGroupModel.deleteMany({}).then((res) => {
            expect(res.ok).to.be.equal(1);
            done();
        });
    });
    it('should delete all existing users', function(done) {
        userModel.deleteMany({}).then((res) => {
            expect(res.ok).to.be.equal(1);
            done();
        });
    })
});

