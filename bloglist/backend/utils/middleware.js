const jwt = require('jsonwebtoken')
const { User } = require('../postgres/models')

const tokenExtractor = (req, res, next) => {
  const authz = req.get('authorization')
  // console.log('authz', authz)
  if (authz && authz.toLowerCase().startsWith('bearer')) {
    // This is how you add a new field/property to a JS object
    req.token = authz.substring(7)
  } else {
    req.token = null
  }

  return next()
}

const userExtractor = async (req, res, next) => {
  if (!req.token) return next()

  const decoded = jwt.verify(req.token, process.env.JWT_SECRET)
  const returnedUser = await User.findByPk(decoded.id)
  if (returnedUser.id === decoded.id) {
    req.user = returnedUser
  } else {
    req.user = null
  }
  return next()
}

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' })

  return next()
}

const errorHandler = (error, req, res, next) => {
  if (error.name === 'SequelizeValidationError') {
    res.status(400).send({
      error: error.message,
    })
  } else if (error.name === 'JsonWebTokenError') {
    res.status(401).send({
      error: 'invalid token',
      detail: error.message,
    })
  } else if (error.name === 'AuthenticationError') {
    res.status(401).send({ error: error.message })
  } else {
    res.status(500).send({ error })
  }

  return next(error)
}

module.exports = {
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
  errorHandler,
}
