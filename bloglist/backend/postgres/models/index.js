const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'blogs_read' })
Blog.belongsToMany(User, { through: ReadingList, as: 'read_by_users' })

module.exports = { Blog, User, ReadingList }
