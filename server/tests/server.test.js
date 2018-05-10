// REQUIRE NPM PACKAGES
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

// REQUIRE VARIABLES AND MODELS
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// CREATE SOME DUMMY OBJECTS FOR TEST
const todos = [
	{_id: new ObjectID(), text: 'First test todo'}, 
	{_id: new ObjectID(), text: 'Second test todo', completed: true, completedAt: 333}
];

// CLEAR DATABASE BEFORE EACH TEST
beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos)
	}).then(() => done());
});

// TESTING THE POST /TODOS ROUTE
describe('POST /todos', () => {
	// SHOULD CREATE A NEW TODO, VALID DATA
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	// SHOULD NOT CREATE NEW TODO, INVALID DATA
	it('should not create todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((e) => done(e));
			});
	});
});


// TESTING GET /TODOS ROUTE
describe('GET /todos', () => {
	// SHOULD FETCH ALL TODOS
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});


// TESTING GET /TODOS/:ID ROUTE
describe('GET /todos/:id', () => {
	// SHOULDE RETURN TODO DOC
	it('should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});
	// SHOULD RETURN 404 IF TODO IS NOT FOUND
	it('should return 404 if todo not found', (done) => {
		request(app)
			.get(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end(done);
	});
	// SHOULD RETURN 404 FOR NON VALID OBJECT ID
	it('should return 404 for non-object id', (done) => {
		request(app)
			.get('/todos/123abc')
			.expect(404)
			.end(done);
	});
});


// TESTING DELETE /TODOS/:ID ROUTE
describe('DELETE /todos/:id', () => {
	// SHOULD REMOVE A TODO BY ID
	it('should remove a todo', (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(hexId).then((todo) => {
					expect(todo).toBeFalsy();
					done();
				}).catch((e) => done(e));
			});
	});
	// SHOULD RETURN 404 IF TODO IS NOT FOUND
	it('should return 404 if todo not found', (done) => {
		request(app)
			.delete(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end(done);
	});
	// SHOULD RETURN 404 IF THE OBJECT ID IS IN INVALID FORMAT
	it('should return 404 if object id is invalid', (done) => {
		request(app)
			.delete('/todos/123abc')
			.expect(404)
			.end(done);
	});
});


// TESTING PATCH /TODOS/:ID ROUTE
describe('PATCH /todos/:id', () => {
	// SHOULD UPDATE THE TODO DOCUMENT
	it('should update the todo', (done) => {
		var hexId = todos[0]._id.toHexString();
		var text = 'This should be the new text';

		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				completed: true,
				text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(typeof res.body.todo.completedAt).toBe('number');
			})
			.end(done);
	});
	// SHOULD KEEP COMPLETEDAT NULL WHEN TODO IS NOT COMPLETED
	it('should clear completedAt when todo is not completed', (done) => {
		var hexId = todos[1]._id.toHexString();
		var text = 'This should be the new text again!';

		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				completed: false,
				text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toBeFalsy();
			})
			.end(done);
	});

});



















