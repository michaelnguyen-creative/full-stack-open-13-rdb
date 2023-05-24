const blogsRouter = require('express').Router()
const { Blog } = require('../postgres/models')
const { AuthenticationError } = require('../utils/error')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
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
    userId: req.user.id,
  })
  const newBlog = await blog.save()

  req.user.blogs = req.user.blogs.concat(newBlog.id)
  await user.save()

  return res.status(201).json(blog)
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
