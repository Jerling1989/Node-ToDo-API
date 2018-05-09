// REQUIRE MONGOOSE
var mongoose = require('mongoose');

// CREATE MONGOOSE TODO MODEL
var User = mongoose.model('User', {
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}
});

// EXPORT USER MODEL
module.exports = {User};