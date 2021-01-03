const { expect } = require('chai')
require('dotenv').config();
process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;

const mongoose = require('mongoose');
const { userModel } = require('../dist/models/mongoose/user.model');
const { attributeGroupModel } = require('../dist/models/mongoose/attribute-group.model');
const { attributeTypeModel } = require('../dist/models/mongoose/attribute-type.model');
const { connectionTypeModel } = require('../dist/models/mongoose/connection-type.model');
const { connectionRuleModel } = require('../dist/models/mongoose/connection-rule.model');
const { itemTypeModel } = require('../dist/models/mongoose/item-type.model');
const { configurationItemModel } = require('../dist/models/mongoose/configuration-item.model');
const { connectionModel } = require('../dist/models/mongoose/connection.model');

describe('Prerequisites', function() {
    before(function() {
        expect(process.env.TEST_MONGODB_URI, 'missing dburi. Check TEST_MONGODB_URI in .env').not.to.be.null;
    });
    
    it('should contain a valid database connection', function() {
        expect(mongoose.connections.length).to.be.greaterThan(0);
    });

    it('should delete all existing connections', function(done) {
        connectionModel.deleteMany({}).then(() => {
            done();
        });
    });
    it('should delete all existing configuration items', function(done) {
        configurationItemModel.deleteMany({}).then(() => {
            done();
        });
    });
    it('should delete all existing connection rules', function(done) {
        connectionRuleModel.deleteMany({}).then(() => {
            done();
        });
    });
    it('should delete all existing item types', function(done) {
        itemTypeModel.deleteMany({}).then(() => {
            done();
        });
    });
    it('should delete all existing connection types', function(done) {
        connectionTypeModel.deleteMany({}).then(() => {
            done();
        });
    });
    it('should delete all existing attribute types', function(done) {
        attributeTypeModel.deleteMany({}).then(() => {
            done();
        });
    });
    it('should delete all existing attribute groups', function(done) {
        attributeGroupModel.deleteMany({}).then(() => {
            done();
        });
    });
    it('should delete all existing users', function(done) {
        userModel.deleteMany({}).then(() => {
            done();
        });
    })
});

