// REQUIRE NPM PACKAGES
const expect = require('expect');
const request = require('supertest');

// REQUIRE VARIABLES AND MODELS
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// CLEAR DATABASE BEFORE EACH TEST
beforeEach((done) => {
	Todo.remove({}).then(() => done());
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

				Todo.find().then((todos) => {
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
					expect(todos.length).toBe(0);
					done();
				}).catch((e) => done(e));
			});
	});

});









