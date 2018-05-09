const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var todoId = '5af31d0d67a15123ed9d8b1a';

if (!ObjectID.isValid(todoId)) {
	console.log('ID not valid');
}

// FIND ALL DOCUMENTS THAT MATCH
Todo.find({
	_id: todoId
}).then((todos) => {
	console.log('Todos', JSON.stringify(todos, undefined, 2));
});

// FIND FIRST DOCUMENT THAT MATCHES
Todo.findOne({
	_id: todoId
}).then((todo) => {
	console.log('Todo', JSON.stringify(todo, undefined, 2));
});

// FIND ONE DOCUMENT BY ID
Todo.findById(todoId).then((todo) => {
	if (!todo) {
		return console.log('ID not found');
	}
	console.log('Todo by ID', JSON.stringify(todo, undefined, 2));
}).catch((e) => console.log(e));

var userId = '5af1c521c0d6df1cf86374ad';

User.findById(userId).then((user) => {
	if (!user) {
		return console.log('User not found');
	}
	console.log('User by ID', JSON.stringify(user, undefined, 2));
}, (e) => {
	console.log(e);
});