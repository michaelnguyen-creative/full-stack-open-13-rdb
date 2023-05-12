require('express-async-errors')
const express = require('express')
const cors = require('cors')

const mongoose = require('mongoose')
const { Sequelize } = require('sequelize')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')

const app = express()
const sequelize = new Sequelize(config.DATABASE_URL)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB at', config.MONGODB_URI))
  .catch((err) => logger.error('MongoDB connection error:', err.message))

sequelize
  .authenticate()
  .then(() => console.log('Connection to PostgresDB has been established'))
  .catch((error) => console.log('Postgres connection errror:', error.message))

app.use(cors())
app.use(express.json())

app.use(middleware.tokenExtractor)

app.use('/blogs', middleware.userExtractor, blogsRouter)
app.use('/users', usersRouter)
app.use('/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  app.use('/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
