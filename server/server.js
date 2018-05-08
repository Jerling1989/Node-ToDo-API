// REQUIRE MONGOOSE LIBRARY
var mongoose = require('mongoose');




// SET MONGOOSE PROMISES
mongoose.Promise = global.Promise;
// CONNECT TO DATABASE
mongoose.connect('mongodb://localhost:27017/TodoApp');

// CREATE MONGOOSE MODEL
var Todo = mongoose.model('Todo', {
	text: {
		type: String
	},
	completed: {
		type: Boolean
	},
	completedAt: {
		type: Number
	}
});

var newTodo = new Todo({
	text: 'Finish node course',
	completed: true,
	completedAt: 123
});

newTodo.save().then((doc) => {
	console.log('Saved todo', JSON.stringify(doc, undefined, 2));
}, (e) => {
	console.log('Unable to save todo');
});