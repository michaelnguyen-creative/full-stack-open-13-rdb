const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const { User, Blog } = require('../models');

// Get all users route, no need to validate session
userRouter.get('/', async (req, res) => {
  const users = await User.findAll({
    // exclude id & passwordHash & timestamp from user object
    attributes: {
      exclude: ['id', 'passwordHash', 'createdAt', 'updatedAt']
    },
    // use eager loading to include blogs
    include: {
      model: Blog,
      attributes: {
        exclude: ['id', 'userId', 'passwordHash', 'createdAt', 'updatedAt']
      }
    },
  });
  res.status(200).json(users);
});

// Get single user route by id
userRouter.get('/:id', async (req, res) => {
  // where object is used to filter the results
  const where = {};

  // if query string is present
  if (req.query?.read) {
    // where object is updated to filter by read status
    where.read = req.query.read === 'true'; // convert string to boolean
  }

  // Find user by id
  const user = await User.findByPk(req.params?.id, {
    // include reading list of blogs as readings
    include: {
      model: Blog,
      as: 'readings',
      attributes: {
        exclude: ['id', 'userId', 'createdAt', 'updatedAt']
      },
      through: {
        attributes: ['id', 'read'],
        where,
      },
    },
    // exclude id & passwordHash & timestamp from user object
    attributes: {
      exclude: ['id', 'passwordHash', 'createdAt', 'updatedAt']
    }
  });
  res.status(200).json(user);
});

// Create new user
userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  // Password validation
  if (password.length >= 3) {
    // Hashing password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = User.build({
      username,
      name,
      passwordHash,
    });
    const newUser = await user.save();

    res.status(201).json(newUser);
  } else {
    res
      .status(400)
      .send({ error: 'password must be at least 3 characters long' });
  }
});

// Update user by username
userRouter.put('/users/:username', async (req, res) => {
  const user = await User.findByPk(req.params.username);
  user.username = req.body.username;
  await user.save();
  res.status(200).json(user);
});

module.exports = userRouter;
