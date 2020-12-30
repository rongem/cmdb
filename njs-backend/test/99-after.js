const mongoose = require('./00-before');

after(function(done) {
    mongoose.disconnect().then(() => {
        done()
    });
})