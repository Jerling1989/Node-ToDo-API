// REQUIRE NPM PACKAGES
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

// REQUIRE MONGOOSE
var {mongoose} = require('./db/mongoose');
// REQUIRE MODELS
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

// CREATE APP VARIABLES
var app = express();
var port = process.env.PORT || 3000;

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


// GET TODOS ROUTE
app.get('/todos', (req, res) => {
	// FETCH ALL TODOS
	Todo.find().then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});


// GET TODO BY ID ROUTE
app.get('/todos/:id', (req, res) => {
	// CREATE ID VARIABLE FROM URL PARAMETER
	var id = req.params.id;
	// CHECK IF ID IS VALID OBJECT ID
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	// FIND TODO BY ID
	Todo.findById(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => res.status(400).send());

});


// SET PORT
app.listen(port, () => {
	console.log(`Running on port ${port}`);
	console.log('--------------------');
	console.log(' ');
});

// EXPORT APP/EXPRESS
module.exports = {app};