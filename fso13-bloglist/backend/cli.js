require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

// console.log('env', process.env)
const sequelize = new Sequelize(process.env.DATABASE_URL_LOCAL)

sequelize
  .query('SELECT * FROM blogs;', { type: QueryTypes.SELECT })
  // .query('', { type: QueryTypes.SHOWTABLES})
  .then((blogs) => printBlogs(blogs))
  .catch((error) => console.log('error executing sequelize query', error))

// sequelize.close()
const printBlogs = (blogs) =>
  blogs.map((b) => console.log(`${b.author}: '${b.title}',`, b.likes, 'likes'))
