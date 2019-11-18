const express = require('express')
const server = express()  //create instance of express server

const usersRouter = require('../users/users-router')
const catRouter = require('../routes/category-router')

const configureMiddleware = require('./api-middleware')
configureMiddleware(server)

server.use(express.json())// allows express to read .json from body of request

server.use('/users', usersRouter)
server.use('/category', catRouter)

server.get('/', (req, res) => { res.status(200).json({hello: 'Web 23'})})

module.exports = server;