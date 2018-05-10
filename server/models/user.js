// REQUIRE NPM PACKAGES
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// CREATE USER SCHEMA
var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

// DEFINE WHAT USER INFO GETS SENT BACK
UserSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

// GENERATE AUTH TOKEN FOR USER (REGULAR FUNCTION TO USE 'this' KEYWORD)
UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth'
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

	user.tokens = user.tokens.concat([{access, token}]);
	return user.save().then(() => {
		return token;
	})
};

// CREATE MONGOOSE USER MODEL
var User = mongoose.model('User', UserSchema);

// EXPORT USER MODEL
module.exports = {User};