const { Blog, User } = require('../postgres/models')

const getAllBlogs = async () => Blog.findAll()
const getAllUsers = async () => User.findAll()
const getFirstItem = (list) => list[0]
const getUserById = async (id) => User.findByPk(id)

module.exports = {
  getAllBlogs,
  getAllUsers,
  getUserById,
  getFirstItem
}
