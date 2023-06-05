const bcrypt = require('bcrypt')
const { Blog, User } = require('../postgres/models')
const data = require('../postgres/seed')

const getAllBlogs = async () => Blog.findAll()
const getAllUsers = async () => User.findAll()
const getUserById = async (id) => User.findByPk(id)
const getBlogById = async (id) => Blog.findByPk(id)

const setupDb = async () => {
  // Seed data:
  try {
    // User table prep
    // Truncate table first, table with foreign key relation requires `cascade` set to true
    await User.destroy({ truncate: true, cascade: true })
    const firstUser = data.users[0]
    const passwordHash = await bcrypt.hash(firstUser.password, 10)
    // Insert a new user
    const user = await User.create({
      username: firstUser.username,
      name: firstUser.name,
      passwordHash,
    })

    // Blog table prep
    await Blog.destroy({ truncate: true, cascade: true })
    const blogs = data.blogs.map((item) => ({ ...item, userId: user.id }))
    await Blog.bulkCreate(blogs, { validate: true })
  } catch (error) {
    console.log('error while setting up db for testing:', error)
  }
}
module.exports = {
  getAllBlogs,
  getAllUsers,
  getUserById,
  getBlogById,
  setupDb
}
