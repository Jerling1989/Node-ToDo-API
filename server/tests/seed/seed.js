// REQUIRE PACKAGES
const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

// CREATE TEST USER IDS
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
// CREATE SOME DUMMY USERS FOR TESTING
const users = [{
	_id: userOneId,
	email: 'jacob@gmail.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
	}]
}, {
	_id: userTwoId,
	email: 'john@doe.com',
	password: 'userTwoPass'
	}];

// CREATE SOME DUMMY OBJECTS FOR TESTING
const todos = [{
	_id: new ObjectID(),
	text: 'First test todo'
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 333
}];

// CLEAR DATABASE AND INSERT TEST TODOS DATA
const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos)
	}).then(() => done());
};

// CLEAR DATABASE AND INSERT TEST USER DATA
const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo]);
	}).then(() => done());
};

// EXPORT FUNCTIONS AND ARRAYS
module.exports = {todos, populateTodos, users, populateUsers};
