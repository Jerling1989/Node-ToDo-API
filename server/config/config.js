// VARIABLE TO GETTING PROPER ENVIRONMENT
var env = process.env.NODE_ENV || 'development';
// IF IN DEVELOPMENT ENVIRONMENT...
if (env === 'development') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// IF IN TESTING ENVIRONMENT...
} else if (env === 'test') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}