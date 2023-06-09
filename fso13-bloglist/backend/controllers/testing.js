const testingRouter = require('express').Router()
const Blog = require('../mongo/models/blog')
const User = require('../mongo/models/user')

// Basic code first
testingRouter.post('/reset', async (req, res) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  res.status(204).end()
})

module.exports = testingRouter
