# Node-ToDo-API
This is a NODE REST API that I created for any developer to utilize in order to make an application that keeps a list of "todo" notes. The API has full CRUD capabilities where users can Create, Read, Update, and Delete the todo notes that they have made. All of the information created by the API is stored in a MongoDB database. The API is built with ES6 JavaScript and JSON, while using node packages like mongodb, mongoose, express, body-parser, lodash, validator, and jsonwebtokens. There are also several dev dependencies for testing like mocha, expect, and supertest.

Below I will show some examples of the API functionality and routes using Postman. I will be using the URL of the API that I have deployed to heroku which is: https://todoapi1221.herokuapp.com/

---

- The first thing the user will have to do is create new user credentials. This is done by going to the POST /users route on the API and entering an email address and password.
![CREATE USER](read_me/1-create-user.png)

- Once the email and password is sent a new user document is created in the mongo database. Below is a screenshot from Robo 3T that shows the new document with a unique id, email, encrypted password, and a x-auth web token for the user.
![MONGO USER](read_me/2-mongo-user.png)

- Now that the user has an account, they can create a "todo" item. By going to the POST /todos route the user can enter the text of what they would like to get done on their todo list. Once the text is submitted a new todo document is created with _id, _creator, text, completed, and completedAt fields.
![CREATE TODO](read_me/3-create-todo.png)

- Below is another example of a todo item being created using the POST /todos route.
![EXAMPLE TODO](read_me/4-example-todo.png)
