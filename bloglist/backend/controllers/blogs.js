const blogsRouter = require('express').Router()
const Blog = require('../postgres/blog')

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

// Delete by ID functionality
blogsRouter.delete('/:id', async (req, res) => {
  // if (req.token === null || req.user === null) {
  //   return res.status(401).send({ error: 'invalid user/token' })
  // }

  await Blog.destroy({ where: { id: req.params.id } })
  return res.status(204).end()
})

// Update amount of likes by ID
// blogsRouter.put('/:id', async (req, res) => {
//   const { likes } = req.body
//   await Blog.findByIdAndUpdate(req.params.id, { likes }, { new: true })
//   res.status(200).end()
// })

module.exports = blogsRouter
