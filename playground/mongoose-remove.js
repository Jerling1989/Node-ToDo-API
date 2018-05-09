const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()


Todo.findOneAndRemove({_id: '5af366884f59ea7da5c37ba1'}).then((todo) => {
	console.log(JSON.stringify(todo, undefined, 2));
});

Todo.findByIdAndRemove('5af366884f59ea7da5c37ba1').then((todo) => {
	console.log(JSON.stringify(todo, undefined, 2));
});
