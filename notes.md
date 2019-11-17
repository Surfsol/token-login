npm init -y - install package.json

create index.js
- make it main: index.js , in package.json
 "main": "index.js"

 git init
- gives me a git ignore
or 
touch .gitignore

npm install express
npm i helmet // protects headers
npm install knex //install globally to use cli command line interface
npm install sqlite3 



npm i nodemon -D // could do global or dev
//scripts: node index.js // does not rerender when saved
scripts: "server":"nodemon index.js" //will rerender upon save<

----------------------------------------------------------------------

index.js

const server = require('./server')

const PORT = process.env.PORT || 4001;

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})
------------------------------------------------------------------
api/server.js

const express = require('express')
const server = express()  //create instance of express server

server.use(express.json())// allows express to read .json from body of request

server.get('/', (req, res) => { res.status(200).json({hello: 'Web 23'})})

module.exports = server;
--------------------------------------
npm install knex

knex  init
// makes a knexfile.js

development: {
    client: 'sqlite3',
    connection: {
      filename: './data/dev.sqlite3'
    },
    useNullAsDefault: true //prevents bugs and issues 
  },
    migrations: {
      directory: './data/migrations' //to put migrations under folder data
    },
    seeds: {
      directory: './data/seeds'
    },
    // add the following
    pool: {
      afterCreate: (conn, done) => {
        // runs after a connection is made to the sqlite engine
        conn.run('PRAGMA foreign_keys = ON', done); // turn on Foreign Key enforcement
      },
    },


--------------------------------------------------------
make a folder called data

Add: db-config.js
-used to connect to database

knex - enables you to access database and write sql statements using js

const knex = require('knex')

const config = require('../knexfile')

module.exports = knex(config.development)
----------------------------------------------------------

migration
knex migrate:make create-resources-table

Understand how to make tables and relationships

components 
-entities (nouns: zoo, animal, species), a resource --> tables
- properties --> columns or fields
- relationships --> Foreign Keys 

workflow
-identify entities
    project
    task
    resource

-identify properties
    projects: 
        id - primary key - integer
        project - string .notNullable
        description - string
        completed - default false

     tasks:
        id - primary key - integer
        task - string .notNullable
        project_id foreign key- integer .notNullable
        notes - string
        completed - default false

    resources:
        id - primary key - integer
        resource - string .notNullable, not unique
        description - string 

    project-resources
        id - primary key - integer
        project_id - fk
        resource_id - fk
        resource #

help to label seeds
http://knexjs.org/#Schema-defaultTo

knex migrate:latest

knex migrate:rollback //if want to undo
-----------------------------------------------------------------------
open in sqlite3

seeds 

knex seed:make 001-recipe

knex seed:run

--------------------------------------------------------------------------
crud

make a folder
add files:

auth/auth-router.js
auth/restricted-middleware.js

users:
/users-helpers.js
/users-helpers.test.js
/users-model.js
/users-router.js

api:
/api-router.js
/middleware.js
-------------------------------------------------------

api:
/api-router.js
/middleware.js

//export / import router and middleware to server.js
//require project routers to server.js

npm i bcryptjs jsonwebtoken

const express = require('express')

const server = express()

//bring in routers
const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

//bring in middleware, then configure it to server
const configureMiddleware = require('./middleware')
configureMiddleware(server)

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.use('/', (req, res) => {
    {res.status(200).json('Its Alive')}
})

module.exports = server


----------------------------------------------------------------------
api-router

npm i bcrypt jsonwebtoken

const router = require('express').Router();
const bcrypt = require('bcryptjs'); //to hash
const jwt = require('jsonwebtoken') //token 
const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
    let user = req.body;
    //always validate data before sending to db
    const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
    user.password = hash;
  
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  
  router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          //produce token
          const token = generateToken(user.username)
          //send token to client
          res.status(200).json({
            message: `Welcome ${user.username}!`,
            token //send token to client
          });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  
  function generateToken(username){
    const payload = {
        subject: user.id, //sub property in header
        username
        //additional data, do not include sensitve info
    }
    const secret = process.env.JWT_SECRET || "aslskek34l4kfnad"
    const options = {
        expiresIn : '8h'
    }
    return jwt.signed(payload, secret, options)
  }
  
  module.exports = router;




helper functions for sql
https://youtu.be/OFLPJfCNAS0
https://github.com/Surfsol/node-db3-challenge/blob/russell-terry/schemes/scheme-model.js


knex migrations: file representing changes to database

----------------------------------------------------------------------------------------
hash 
npm i bcryptjs
const bcrypt = require('bcryptjs')

 //hash the password using bcryptjs
    const hash = bcrypt.hashSync(password, 8);

 //check that password is valid
         if(user && bcrypt.compareSync(password, user.password))

----------------------------------------------------------------------------------------
protected route

token will be stored in localstorage, can do it on react

//middleware takes req, res, next
  //ensure user is logged in
  function protected(req, res, next){
    let {username, password} = req.headers
     if 
    (username && password){
      Users.findBy({username})
      //database queries return an array, but we are looking for an object, use .first()
      .first()
      .then(user => {
        if(user && bcrypt.compareSync(password, user.password)){
            
          next()
--------------------------------------------------------------------------------------------------------          
express-session
npm i express-session
- manages sessons

1. client sends credentials.
2. server verify credentials.
3. server creates a session for the client.
    - node, can use, either:
    express-session or client-sessions
    - data stored in memory is wiped when the server restarts.
4. server produces and sends back cookie.
     HTTP message. Every HTTP message, be it a request or a response, has two main parts: the headers and the body.
    HEAD
     - To send cookies the server will add the Set-Cookie header to the response like so: "Set-Cookie": "session=12345"
     - library for creating and sending cookies
    BODY
    -The body contains the data portion of the message
5. client stores the cookie.
6. client sends cookie on every request.
7. server verifies that cookie is valid.
8. server provides access to resource.

express-session - handle sessions
-----------------------------------------------------------------------------------
testing

validate data

business logic, something that makes your business unique.

validation is another layer, that should be isolated. Don't tie validation data to router or middleware. should be seperate.

users-helpers.js


 const { validateUser } = require("../users/users-helpers.js");

<!-- // for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
    let user = req.body;
    console.log(user) -->
    //always validate data before sending to db
    const validateResult = validateUser(user);

    if (validateResult.isSuccessful === true){

    <!-- const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
    user.password = hash;
    console.log(`hash`, hash)
  
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(err => {
        res.status(500).json(err);
      }); -->

    } else {
        res.status(400).json({
            message: 'Invalid info about user',
        errors: validateResult.errors})
    }
  });
--------------------------------------------------------------------------------
test logic should never fail.
so use jest to test function, to make sure always working correctly
create: users-helpers.test.js  // must end in test.js or spec.js will be executed by jest

npm i jest -D

add to package.json

"test": "jest --watch" // continuously watch

"jest": {"testEnvironment": "node"}

write code to test our code