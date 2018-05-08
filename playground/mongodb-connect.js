// REQUIRE MONGOCLIENT
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // This is a better way than above with ES6 object destructoring


// CREATE MONGO DATABASE CONNECTION
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	// IF THERES A CONNECTION ERROR LOG MESSAGE ON CONSOLE
	if(err) {
		return console.log('Unable to connect to MongoDB server');
		// ELSE LOG THAT USER IS CONNECTED ON CONSOLE
	} else {
		console.log('Connected to MongoDB server');
	}
	// CREATE DB VARIABLE
	const db = client.db('TodoApp');

	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert Todo', err);
	// 	} else {
	// 		console.log(JSON.stringify(result.ops, undefined, 2));
	// 	}
	// });

	// // INSERT A DOCUMENT INTO THE USERS COLLECTION
	// db.collection('Users').insertOne({
	// 	name: 'Jordan',
	// 	age: 31,
	// 	location: 'California'
	// }, (err, result) => {
	// 	// IF THERE IS AN ERROR LOG THE ERROR MESSAGE TO THE CONSOLE
	// 	if (err) {
	// 		return console.log('Unable to insert User', err);
	// 		// ELSE LOG THE NEW DOCUMENT TO THE CONSOLE
	// 	} else {
	// 		console.log(result.ops[0]._id.getTimestamp());
	// 	}
	// });

	// DISCONNECT FROM MONGO DATABASE
	client.close();
});