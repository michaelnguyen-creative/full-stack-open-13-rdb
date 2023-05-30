require('express-async-errors')
const express = require('express')
const cors = require('cors')

const middleware = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const testRouter = require('./controllers/testing')

const app = express()

app.use(cors())
app.use(express.json())

app.use(middleware.tokenExtractor, middleware.userExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)


if (process.env.NODE_ENV === 'test') {
  app.use('/test', testRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
