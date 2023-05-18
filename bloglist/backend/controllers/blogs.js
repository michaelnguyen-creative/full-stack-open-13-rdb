const blogsRouter = require('express').Router()
const { Blog } = require('../postgres/models')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body

  if (title === '' || url === '') {
    res.status(400).send({ error: 'Missing title and/or URL' })
  }
  // else if (req.token === null) {
  //   return res.status(401).send({ error: 'token missing' })
  // }

  // const user = await User.findById(req.user._id)
  const blog = Blog.build({
    title,
    author,
    url,
    likes,
    // DO this, refer to Mongo document by _id
    // user: req.user._id,
  })
  const savedBlog = await blog.save()

  // user.blogs = user.blogs.concat(savedBlog._id)
  // await user.save()

  return res.status(201).json(savedBlog)
})

const findBlog = async (req, _res, next) => {
  const blog = await Blog.findByPk(req.params?.id)
  req.blog = blog
  next()
}
// Delete by ID functionality
blogsRouter.delete('/:id', findBlog, async (req, res) => {
  // if (req.token === null || req.user === null) {
  //   return res.status(401).send({ error: 'invalid user/token' })
  // }
  if (req.blog) {
    await req.blog.destroy()
    return res.status(204).end()
  }
})

blogsRouter.put('/:id', findBlog, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body?.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

module.exports = blogsRouter
