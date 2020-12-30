const mongoose = require('mongoose');

after(function(done) {
    mongoose.disconnect().then(() => {
        done()
    });
})