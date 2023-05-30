const Blog = require('./blog')
const User = require('./user')
const { sequelize } = require('../init')

User.hasMany(Blog)
Blog.belongsTo(User)

module.exports = { Blog, User }
