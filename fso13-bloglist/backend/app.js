require('express-async-errors')
const express = require('express')
const cors = require('cors')

const middleware = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readingListRouter = require('./controllers/readingList')
const logoutRouter = require('./controllers/logout')

const app = express()

app.use(cors())
app.use(express.json())

// Entrypoint for accessing server resources
app.use('/api/login', loginRouter)

// Use middleware to validate token and session
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/authors', authorsRouter)
// Use readingListRouter at /api/readinglists
app.use('/api/readinglists', readingListRouter)
// use logoutRouter at /api/logout
app.use('/api/logout', logoutRouter)

// Use middleware to handle unknown endpoints and errors
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
