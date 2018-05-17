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
app.post('/todos', authenticate, (req, res) => {
	// CREATE NEW TODO OBJECT
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});
	// SAVE NEW TODO OBJECT TO DATABASE (DOCUMENT)
	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});


// GET TODOS ROUTE
app.get('/todos', authenticate, (req, res) => {
	// FETCH ALL TODOS
	Todo.find({
		_creator: req.user._id
	}).then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});


// GET TODO BY ID ROUTE
app.get('/todos/:id', authenticate, (req, res) => {
	// CREATE ID VARIABLE FROM URL PARAMETER
	var id = req.params.id;
	// CHECK IF ID IS VALID OBJECT ID
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	// FIND TODO BY ID
	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => res.status(400).send());

});


// DELETE TODO BY ID ROUTE
app.delete('/todos/:id', authenticate, async (req, res) => {
	// CREATE ID VARIABLE FROM URL PARAMETER
	const id = req.params.id;
	// CHECK IF ID IS VALID OBJECT ID
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	try {
		// FIND AND DELETE TODO BY ID
		const todo = await Todo.findOneAndRemove({
			_id: id,
			_creator: req.user._id
		});
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	} catch (e) {
		res.status(400).send();
	}
});


// UPDATE TODO BY ID ROUTE
app.patch('/todos/:id', authenticate, (req, res) => {
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
	Todo.findOneAndUpdate({
		_id: id,
		_creator: req.user._id
	}, {$set: body}, {new: true}).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => res.status(400).send());
});


// POST NEW USER ROUTE
app.post('/users', async (req, res) => {
	try {
		// CREATE VARIABLE FOR REQ BODY
		const body = _.pick(req.body, ['email', 'password']);
		// CREATE NEW USER OBJECT
		const user = new User(body);
		// SAVE NEW USER OBJECT TO DB (DOCUMENT)
		await user.save();
		// GENERATE TOKEN FOR USER
		const token = await user.generateAuthToken();
		// SEND USER WITH TOKEN TO DB
		res.header('x-auth', token).send(user);	
	} catch (e) {
		res.status(400).send(e);
	}
});


// GET USER USING API ROUTE
app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});


// POST /USERS/LOGIN ROUTE
app.post('/users/login', async (req, res) => {
	try {
		// CREATE VARIABLE FOR REQ BODY
		const body = _.pick(req.body, ['email', 'password']);
		// MAKE SURE CREDENTIALS ARE CORRECT
		const user = await User.findByCredentials(body.email, body.password);
		const token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	} catch (e) {
		res.status(400).send();
	}
});


// DELETE /USERS/ME/TOKEN
app.delete('/users/me/token', authenticate, async (req, res) => {
	try {
		// REMOVE TOKEN FROM USER (LOG OUT)
		await req.user.removeToken(req.token);
		res.status(200).send();
	} catch (e) {
		res.status(400).send();
	}
});


// SET PORT LISTENER
app.listen(port, () => {
	console.log('Running on port 3000');
	console.log('--------------------');
	console.log(' ');
});

// EXPORT APP/EXPRESS
module.exports = {app};