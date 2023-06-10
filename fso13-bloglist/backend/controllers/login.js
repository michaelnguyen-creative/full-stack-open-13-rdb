const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const { User } = require("../models");
// require sessionManager
const SessionManager = require("../utils/sessionManager");

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;
  // Check provided password against password hash stored in db
  const user = await User.findOne({ where: { username } });
  // If user doesn't exist, return error
  if (!user) {
    return res.status(400).json({ error: "invalid username" });
  }

  // Check if password is correct
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  // If password is correct, create jwt token & initialize session
  if (passwordCorrect) {
    // set experation time for jwt token to 1 hour
    const expiresIn = 60 * 60;
    // create jwt token
    const token = jwt.sign(
      {
        username: user.username,
        userId: user.id,
      },
      // set jwt token expiration time to 1 hour
      process.env.JWT_SECRET,
      { expiresIn }
    );

    // create session
    await SessionManager.createSession(token, user.id, expiresIn);

    res.status(200).send({
      token,
      username: user.username,
      name: user.name,
    });
  } else {
    // If password is incorrect, return error
    res.status(400).json({ error: "incorrect password" });
  }
});

module.exports = loginRouter;
