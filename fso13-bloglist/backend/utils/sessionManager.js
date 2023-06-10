// sessionManager.js
const { Session } = require("../models");

// sessionManager class
class SessionManager {
  // create new session
  // set default expiration time to 1 hour
  static async createSession(token, userId, expiresAt = 60 * 60) {
    const session = await Session.create({
      id: token,
      userId,
      expiresAt: new Date(Date.now() + expiresAt * 1000),
    });

    return session;
  }

  // find session by id
  static async findSession(id) {
    const session = await Session.findByPk(id);

    return session;
  }

  // delete session by id
  static async deleteSession(id) {
    const session = await Session.destroy({ where: { id } });

    return session;
  }
}

module.exports = SessionManager;