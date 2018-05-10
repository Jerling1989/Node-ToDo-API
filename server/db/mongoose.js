// REQUIRE MONGOOSE
var mongoose = require('mongoose');
// SET MONGOOSE PROMISES
mongoose.Promise = global.Promise;
// CONNECT TO DATABASE (HEROKU OR LOCALHOST)
mongoose.connect(process.env.MONGODB_URI);
// EXPORT MONGOOSE VARIABLE
module.exports = {mongoose};

