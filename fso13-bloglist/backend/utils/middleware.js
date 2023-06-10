const jwt = require('jsonwebtoken')
const { User } = require('../models')
// require SessionManager
const SessionManager = require('./sessionManager')

const tokenExtractor = (req, _res, next) => {
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

// sessionValidator middleware
const sessionValidator = async (req, res, next) => {
  // check if token exists
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }
  // validate token (including its expiration duration)
  const decoded = jwt.verify(req.token, process.env.JWT_SECRET)
  const session = await SessionManager.findSession(req.token)
  // Three conditions to check:
  // 1. session exists
  // 2. session user id matches the user id in the request params
  // 3. session is not expired
  const userMatched = session && session.userId === decoded.userId
  const sessionExpired = session && session.expiresAt < Date.now()

  if (!userMatched) {
    return res.status(401).json({ error: 'invalid token' })
  } else if (sessionExpired) {
    // remove token from request & delete session
    req.token = null
    await SessionManager.deleteSession(req.token)
    return res.status(401).json({ error: 'token expired' })
  } else {
    // find user by id
    const user = await User.findByPk(decoded.userId)
    // set req.user to the user object
    req.user = user
    return next()
  }
}

const unknownEndpoint = (_req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' })
  return next()
}

const errorHandler = (error, req, res, next) => {
  if (
    [
      'SequelizeValidationError',
      'SequelizeDatabaseError',
    ].includes(error.name)
  ) {
    res.status(400).json({
      error: error.message,
    })
  } else if (
    ['JsonWebTokenError', 'AuthenticationError'].includes(error.name)
  ) {
    res.status(401).send({
      error: error.message,
    })
  } else {
    res.status(500).json({ error: error.message })
  }

  return next(error)
}

module.exports = {
  unknownEndpoint,
  tokenExtractor,
  sessionValidator,
  errorHandler,
}
