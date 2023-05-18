class AuthenticationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

class BadUserInputError extends Error {
  constructor(message) {
    super(message)
    this.name = 'BadUserInputError'
  }
}
module.exports = { AuthenticationError, BadUserInputError }
