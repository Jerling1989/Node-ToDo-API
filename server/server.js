// REQUIRE MONGOOSE LIBRARY
var mongoose = require('mongoose');




// SET MONGOOSE PROMISES
mongoose.Promise = global.Promise;
// CONNECT TO DATABASE
mongoose.connect('mongodb://localhost:27017/TodoApp');

// CREATE MONGOOSE TODO MODEL
var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	}
});

// // CREATE NEW TODO DOCUMENT
// var newTodo = new Todo({
// 	text: 'Email tech recruiter'
// });

// // SAVE NEW TODO DOCUMENT TO DATABASE
// newTodo.save().then((doc) => {
// 	console.log('Saved todo', JSON.stringify(doc, undefined, 2));
// }, (e) => {
// 	console.log('Unable to save todo', e);
// });


// CREATE MONGOOSE TODO MODEL
var User = mongoose.model('User', {
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}
});

// CREATE NEW USER DOCUMENT
var newUser = new User({
	email: 'jerling1989@gmail.com'
});

// SAVE NEW USER DOCUMENT TO DATABASE
newUser.save().then((doc) => {
	console.log('Saved user', JSON.stringify(doc, undefined, 2));
}, (e) => {
	console.log('Unable to save user', e);
});
