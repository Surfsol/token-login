const express = require('express')
const server = express()  //create instance of express server

const usersRouter = require('../users/users-router')

const configureMiddleware = require('./api-middleware')
configureMiddleware(server)

server.use(express.json())// allows express to read .json from body of request

server.use('/users', usersRouter)

server.get('/', (req, res) => { res.status(200).json({hello: 'Web 23'})})

module.exports = server;