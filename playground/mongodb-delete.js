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

	// deleteMany
	// db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
	// 	console.log(result);
	// });

	db.collection('Users').findOneAndDelete({
		_id: new ObjectID('5af1233eda5d4d119426203a')
	}).then((result) => {
		console.log(JSON.stringify(result, undefined, 2));
	});

	// deleteOne
	// db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
	// 	console.log(result);
	// });

	// findOneAndDelete
	// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
	// 	console.log(result);
	// });

	// DISCONNECT FROM MONGO DATABASE
	// client.close();
});