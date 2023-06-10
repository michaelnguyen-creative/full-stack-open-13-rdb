const blogsRouter = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const middleware = require('../utils/middleware')

// This code block defines a GET endpoint for retrieving blogs.
// The endpoint accepts a query parameter 'search' which is used to filter the blogs by title or author.
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

// All routes below this middleware require a valid session
blogsRouter.use(middleware.sessionValidator)


blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes, year } = req.body
  if (!req.user) {
    return res.status(401).json({ error: 'invalid user' })
  }

  const blog = Blog.build({
    title,
    author,
    url,
    likes,
    year,
    userId: req.user.id,
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
  if (!req.user) {
    return res.status(401).json({ error: 'invalid user' })
  }
  await req.blog.destroy()
  res.status(204).end()
})

blogsRouter.put('/:id', findBlog, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'invalid user' })
  }
  if (req.blog) {
    req.blog.likes = req.body?.likes
    await req.blog.save()
    res.status(200).json(req.blog)
  } else {
    res.status(404).end()
  }
})

module.exports = blogsRouter
