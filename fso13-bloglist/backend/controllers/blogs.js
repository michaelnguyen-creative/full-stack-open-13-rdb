const blogsRouter = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../postgres/models')
const { AuthenticationError } = require('../utils/error')


// This code block defines a GET endpoint for retrieving blogs.
// The endpoint accepts a query parameter 'search' which is used to filter the blogs by title or author.
// The blogs are sorted in descending order by the number of likes.
// The endpoint returns a JSON response containing an array of blogs.
// Each blog object contains the blog's title, author, url, likes, year, and the name of the user who created the blog.
blogsRouter.get('/', async (req, res) => {
  let where = {}
  if (req.query?.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ]
  }
  const blogs = await Blog.findAll({
    where,
    attributes: {
      exclude: ['UserId'],
    },
    include: {
      model: User,
      attributes: ['name'],
    },
    order: [['likes', 'DESC']]
  })
  res.json(blogs)
})



// This code block defines a POST endpoint for creating a new blog.
// The endpoint accepts a JSON request body containing the blog's title, author, url, likes, and year.
// The endpoint requires authentication, and the user who created the blog is determined from the JWT token.
// The endpoint returns a JSON response containing the newly created blog object.
blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes, year } = req.body
  if (!req.user) throw new AuthenticationError('Invalid user')

  const blog = Blog.build({
    title,
    author,
    url,
    likes,
    year,
    UserId: req.user.id,
  })
  const newBlog = await blog.save()

  res.status(201).json(newBlog)
})

const findBlog = async (req, _res, next) => {
  const blog = await Blog.findByPk(req.params?.id)
  req.blog = blog
  next()
}

blogsRouter.delete('/:id', findBlog, async (req, res) => {
  if (!req.token || !req.user) {
    throw new AuthenticationError('Invalid token or user')
  }
  await req.blog.destroy()
  res.status(204).end()
})

blogsRouter.put('/:id', findBlog, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body?.likes
    await req.blog.save()
    res.status(200).json(req.blog)
  } else {
    res.status(404).end()
  }
})

module.exports = blogsRouter
