const mongoose = require('mongoose');
const constants = require('./private_constants');

mongoose.connect(constants.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then((res) => {
    console.log('Connected with Mongo');
})
.catch(err => {
    console.log({
        status: 401,
        message: 'Database connection failed',
        error: err
    });
}) 