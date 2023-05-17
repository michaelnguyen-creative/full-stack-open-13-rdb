const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../postgres/models')

userRouter.get('/', async (req, res) => {
  const users = await User.findAll()
  res.status(200).json(users)
})

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  // Password validation
  if (password.length >= 3) {
    // Hashing password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = User.build({
      username,
      name,
      passwordHash,
    })
    const newUser = await user.save()

    res.status(201).json(newUser)
  } else {
    res.status(400).send({ error: 'password must be at least 3 characters long' })
  }
})

userRouter.put('/users/:username', async (req, res) => {
  const user = await User.findByPk(req.params.username)
  user.username = req.body.username
  await user.save()
  res.status(200).json(user)
})

module.exports = userRouter
