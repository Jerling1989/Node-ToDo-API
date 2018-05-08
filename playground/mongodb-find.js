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

	// db.collection('Todos').find({
	// 	_id: new ObjectID("5af127dc9fd5dae4dccb0ea6")
	// }).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch Todos');
	// });

	// db.collection('Todos').find().count().then((count) => {
	// 	console.log(`Todos count: ${count}`);
	// }, (err) => {
	// 	console.log('Unable to fetch Todos');
	// });

	// FIND DOCUMENT WITH KEY AND VALUE PAIR INSIDE USERS COLLECTION
	db.collection('Users').find({name: 'Jacob'}).toArray().then((docs) => {
		console.log('Users');
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('Unable to fetch Users', err);
	});

	// DISCONNECT FROM MONGO DATABASE
	// client.close();
});