const supertest = require('supertest')
const bcrypt = require('bcrypt')
const { sequelize } = require('../postgres/init')
const app = require('../app')
const { Blog, User } = require('../postgres/models')
const helper = require('../utils/testHelper')
const seedData = require('../postgres/seed')

const api = supertest(app)

beforeEach(async () => {
  // Blog database prep
  await Blog.destroy({ truncate: true })
  await Blog.bulkCreate(seedData.blogs)

  // User database prep
  await User.destroy({ truncate: true })
  const firstUser = helper.getFirstItem(seedData.users)
  const passwordHash = await bcrypt.hash(firstUser.password, 10)
  await User.create({
    username: firstUser.username,
    name: firstUser.name,
    passwordHash,
  })
})

describe('getting all blogs api', () => {
  test('blogs are returned as json', async () => {
    await api.get('/api/blogs').expect('Content-Type', /application\/json/)
  })

  // test('blogs _id prop are replaced by id', async () => {
  //   const blogs = await api.get('/api/blogs')
  //   expect(blogs.body.map((b) => b.id)).toBeDefined()
  // })
})

describe('adding a new blog api', () => {
  test('new blog is created with valid token', async () => {
    const initialBlogs = await helper.getAllBlogs()
    const newBlog = {
      title: "Murphy's law",
      author: 'Wiki',
      url: 'https://en.wikipedia.org/wiki/Murphy%27s_law',
      likes: 100,
    }

    const res = await api.post('/api/login').send(seedData.users[0]).expect(200)

    const token = res.body.token
    console.log('token', token)
    expect(token).toBeDefined()

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' })
      .send(newBlog)
      .expect(201)
    const allBlogs = await helper.getAllBlogs()
    expect(allBlogs).toHaveLength(initialBlogs.length + 1)
  })

  test('if likes prop is missing, it will default to 0', async () => {
    const newBlog = {
      title: "Murphy's law",
      author: 'Wiki',
      url: 'https://en.wikipedia.org/wiki/Murphy%27s_law',
    }

    const respond = await api.post('/api/login').send(seedData.users[0])

    const res = await api
      .post('/api/blogs')
      .auth(respond.body.token, { type: 'bearer' })
      .send(newBlog)
      .expect(201)
    // Keep it simple, stupid (KISS principle)
    expect(res.body).toMatchObject({ likes: '0' })
  })

  test('create a new blog without title & url will return a 400 Bad Request status code', async () => {
    const newBlog = {
      author: 'Wiki',
      likes: 22,
    }
    const respond = await api.post('/api/login').send(seedData.users[0])

    await api
      .post('/api/blogs')
      .auth(respond.body.token, { type: 'bearer' })
      .send(newBlog)
      .expect(400)
  })

  test('adding a new blog fails with status code 401 if token is not provided', async () => {
    const newBlog = {
      title: "Murphy's law",
      author: 'Wiki',
      url: 'https://en.wikipedia.org/wiki/Murphy%27s_law',
      likes: 100,
    }

    await api
      .post('/api/blogs')
      .auth(null, { type: 'bearer' })
      .send(newBlog)
      .expect(401)
  })
})

describe('deleting a blog by id', () => {
  test('logged in user & valid id returns 204 No Content', async () => {
    const blogs = await helper.getAllBlogs()
    const validFirstId = blogs[0].id

    const respond = await api.post('/api/login').send(seedData.users[0])

    await api
      .delete(`/api/blogs/${validFirstId}`)
      .auth(respond.body.token, { type: 'bearer' })
      .expect(204)
  })

  test('logged in user & invalid id returns 400 Bad Request', async () => {
    const invalidId = 'dfad9dfad0dfadfad'
    const respond = await api.post('/api/login').send(seedData.users[0])

    await api
      .delete(`/api/blogs/${invalidId}`)
      .auth(respond.body.token, { type: 'bearer' })
      .expect(400)
  })
})

describe('updating a blog api', () => {
  test('updating a valid id returns 200 OK', async () => {
    const blogs = await helper.getAllBlogs()
    const validFirstId = blogs[0].id
    const likesToUpdate = { likes: 40 }

    await api.put(`/api/blogs/${validFirstId}`).send(likesToUpdate).expect(200)
  })
})

afterAll(() => {
  sequelize.close()
})
