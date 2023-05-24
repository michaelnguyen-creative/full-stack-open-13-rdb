const Blog = require('./blog')
const User = require('./user')
const { sequelize } = require('../init')

User.hasMany(Blog)
Blog.belongsTo(User)
sequelize.sync({ alter: true })

module.exports = { Blog, User }
