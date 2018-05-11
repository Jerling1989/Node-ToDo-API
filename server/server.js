require('./config/config')
// REQUIRE NPM PACKAGES
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
// REQUIRE FROM LOCAL FILES
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

// CREATE APP VARIABLES
var app = express();
var port = process.env.PORT;

// USE BODYPARSER MIDDLEWARE
app.use(bodyParser.json());


// POST NEW TODO ROUTE
app.post('/todos', (req, res) => {
	// CREATE NEW TODO OBJECT
	var todo = new Todo({
		text: req.body.text
	});
	// SAVE NEW TODO OBJECT TO DATABASE (DOCUMENT)
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


// DELETE TODO BY ID ROUTE
app.delete('/todos/:id', (req, res) => {
	// CREATE ID VARIABLE FROM URL PARAMETER
	var id = req.params.id;
	// CHECK IF ID IS VALID OBJECT ID
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	// FIND AND DELETE TODO BY ID
	Todo.findByIdAndRemove(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => res.status(400).send());
});


// UPDATE TODO BY ID ROUTE
app.patch('/todos/:id', (req, res) => {
	// CREATE ID VARIABLE FROM URL PARAMETER
	var id = req.params.id;
	// CREATE VARIABLE FOR REQ BODY
	var body = _.pick(req.body, ['text', 'completed']);
	// CHECK IF ID IS VALID OBJECT ID
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	// IF COMPLETED VALUE IS BOOLEAN AND TRUE
	if (_.isBoolean(body.completed) && body.completed) {
		// SET TIME FOR COMPLETEDAT
		body.completedAt = new Date().getTime();
	// ELSE
	} else {
		// SET COMPLETED TO FALSE AND COMPLETED AT TO NULL
		body.completed = false;
		body.completedAt = null;
	}

	// FIND AND UPDATE TODO
	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => res.status(400).send());
});


// POST NEW USER ROUTE
app.post('/users', (req, res) => {
	// CREATE VARIABLE FOR REQ BODY
	var body = _.pick(req.body, ['email', 'password']);
	// CREATE NEW USER OBJECT
	var user = new User(body);
	// SAVE NEW USER OBJECT TO DB (DOCUMENT)
	user.save().then(() => {
		// GENERATE TOKEN FOR USER
		return user.generateAuthToken();
	}).then((token) => {
		// SEND USER WITH TOKEN TO DB
		res.header('x-auth', token).send(user);
	}).catch((e) => res.status(400).send(e));
});


// GET USER USING API ROUTE
app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});


// POST /USERS/LOGIN ROUTE
app.post('/users/login', (req, res) => {
	// CREATE VARIABLE FOR REQ BODY
	var body = _.pick(req.body, ['email', 'password']);
	// MAKE SURE CREDENTIALS ARE CORRECT
	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		});
	}).catch((e) => res.status(400).send())
});


// DELETE /USERS/ME/TOKEN
app.delete('/users/me/token', authenticate, (req, res) => {
	// REMOVE TOKEN FORM USER (LOG OUT)
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, () => {
		res.status(400).send();
	});
});


// SET PORT
app.listen(port, () => {
	console.log(`Running on port ${port}`);
	console.log('--------------------');
	console.log(' ');
});

// EXPORT APP/EXPRESS
module.exports = {app};