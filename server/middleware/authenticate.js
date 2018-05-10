// REQUIRE USER
var {User} = require('./../models/user');

// AUTHENTICATION MIDDLEWARE
var authenticate = (req, res, next) => {
	// CREATE TOKEN VARIABLE
	var token = req.header('x-auth');

	User.findByToken(token).then((user) => {
		if (!user) {
			return Promise.reject();
		}

		req.user = user;
		req.token = token;
		next();
	}).catch((e) => res.status(401).send());
};

// EXPORT FUNCTION
module.exports = {authenticate};