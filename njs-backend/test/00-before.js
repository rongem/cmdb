const { expect } = require('chai')
require('dotenv').config();
const dburi = process.env.TEST_MONGODB_URI;
const mongoose = require('mongoose');

before(function(done) {
    expect(dburi, 'missing dburi. Check TEST_MONGODB_URI in .env').not.to.be.null;
    mongoose.connect('x' + dburi, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
        done();
    });
});

describe('Prerequisites', function() {
    it('should contain a valid database connection', function() {
        expect(mongoose.connections.length).to.be.greaterThan(0);
    });
});

module.exports = mongoose;
