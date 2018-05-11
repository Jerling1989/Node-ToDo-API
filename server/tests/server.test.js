// REQUIRE NPM PACKAGES
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

// REQUIRE VARIABLES AND MODELS
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// CLEAR DATABASE AND INSERT TEST DATA BEFORE EACH TEST
beforeEach(populateUsers);
beforeEach(populateTodos);

// TESTING THE POST /TODOS ROUTE
describe('POST /todos', () => {
	// SHOULD CREATE A NEW TODO, VALID DATA
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
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
			.set('x-auth', users[0].tokens[0].token)
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
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(1);
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


// TESTING GET /USERS/ME ROUTE
describe('GET /users/me', () => {
	// SHOULD RETURN USER IF AUTHENTICATION IS CORRECT
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});
	// SHOULD RETURN 401 ERROR IF AUTHENTICATION FAILS
	it('should return a 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});


// TESTING POST /USERS ROUTE
describe('POST /users', () => {
	// SHOULD CREATE A USER WHEN VALID DATA IS ENTERED
	it('should create a user', (done) => {
		var email = 'example@email.com';
		var password = 'abc123!';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeTruthy();
				expect(res.body._id).toBeTruthy();
				expect(res.body.email).toBe(email);
			})
			.end((err) => {
				if (err) {
					return done(err);
				}
				User.findOne({email}).then((user) => {
					expect(user).toBeTruthy();
					expect(user.password).not.toBe(password);
					done();
				}).catch((e) => done(e));
			});
	});
	// SHOULD RETURN ERROR IF INFO ENTERED IS INVALID
	it('should return validation errors if request invalid', (done) => {
		var email = 'bademail';
		var password = 'bad';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});
	// SHOULD NOT CREATE USER IF EMAIL IS ALREADY IN USE
	it('should not create user if email in use', (done) => {
		var email = 'jacob@gmail.com';
		var password = 'abc123!';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});
});


// TESTING POST /USERS/LOGIN ROUTE
describe('POST /users/login', () => {
	// SHOULD LOG IN USER WHEN THEY ENTER VALID LOGIN CREDENTIALS
	it('should login user and return auth token', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeTruthy();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[0]).toMatchObject({
						access: 'auth',
						token: res.headers['x-auth']
					});
					done();
				}).catch((e) => done(e));
			});
	});
	// SHOULD REJECT LOGIN WHEN USER ENTERS WRONG CREDENTIALS
	it('should reject invalid login', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password + '1'
			})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeFalsy();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch((e) => done(e));
			});
	});
});


// TESTING DELETE /USERS/ME/TOKEN ROUTE
describe('DELETE /users/me/token', () => {
	// SHOULD REMOVE AUTH TOKEN ON LOGOUT
	it('should remove auth token on logout', (done) => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch((e) => done(e));
			});
	});
});
