const blogsRouter = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../postgres/models')
const { AuthenticationError } = require('../utils/error')

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

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body
  if (!req.user) throw new AuthenticationError('Invalid user')

  const blog = Blog.build({
    title,
    author,
    url,
    likes,
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
