// logoutRouter
const logoutRouter = require('express').Router()
const { Session } = require('../models')
// require SessionManager
const SessionManager = require('../utils/sessionManager')

logoutRouter.post('/', async (req, res) => {
    // Get token from the request header
    const { authorization: token } = req.headers
    // Delete session
    await SessionManager.deleteSession(token)
    // Return success message
    res.status(200).json({ message: 'Logged out successfully' })
})

// export router
module.exports = logoutRouter