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

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5af122bda8457611821fc240')
	}, {
		$set: {
			location: 'New Jersey'
		},
		$inc: {
			age: 2;
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});


	// DISCONNECT FROM MONGO DATABASE
	// client.close();
});