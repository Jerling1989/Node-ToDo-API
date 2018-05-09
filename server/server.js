// REQUIRE NPM PACKAGES
var express = require('express');
var bodyParser = require('body-parser');

// REQUIRE MONGOOSE
var {mongoose} = require('./db/mongoose');
// REQUIRE MODELS
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

// CREATE APP VARIABLE
var app = express();
// USE BODYPARSER MIDDLEWARE
app.use(bodyParser.json());

// POST NEW TODO ROUTE
app.post('/todos', (req, res) => {
	// CREATE NEW TODO OBJECT
	var todo = new Todo({
		text: req.body.text
	});
	// SAVE NEW TODO OBJECT TO DATABASE
	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});


// SET PORT
app.listen(3000, () => {
	console.log('Running on port 3000');
});

// EXPORT APP/EXPRESS
module.exports = {app};