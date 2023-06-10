const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('../utils/testHelper')
const seedData = require('../postgres/seed')
const { sequelize, connectToPostgres } = require('../utils/connectPostgres')

beforeAll(async () => {
  await connectToPostgres()
})

beforeEach(async () => {
  await helper.setupDb()
})

describe('GET /api/blogs', () => {
  test('returns all blogs as JSON', async () => {
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    // console.log('response.body', response.body);
    expect(response.body).toHaveLength(seedData.blogs.length)
  })

  test('each blog displays the user who created it', async () => {
    const res = await api.get('/api/blogs')
    res.body.forEach((item) => {
      expect(item.user).toMatchObject({ name: seedData.users[0].name })
    })
  })

  describe('with query string', () => {
    test('returns all blogs, which title includes case-insensitive "react" search keyword', async () => {
      const res = await api.get('/api/blogs?search=react')
      // console.log('res', JSON.stringify(res.body), res.statusCode)
      res.body.forEach(({ title }) => {
        expect(title).toMatch(/react/i)
      })
    })
    test('returns blogs with keyword in either title or author', async () => {
      const query = 'ar'
      const res = await api.get(`/api/blogs?search=${query}`)
      const filteredBlogs = seedData.blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.author.toLowerCase().includes(query)
      )

      expect(res.body).toHaveLength(filteredBlogs.length)
    })
  })
  test('returns all blogs as JSON in descending order of likes', async () => {
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    const blogs = response.body
    expect(blogs).toHaveLength(seedData.blogs.length)
    for (let i = 0; i < blogs.length - 1; i++) {
      expect(blogs[i].likes).toBeGreaterThanOrEqual(blogs[i + 1].likes)
    }
    const sortedBlogs = blogs.slice().sort((a, b) => b.likes - a.likes)
    expect(blogs).toEqual(sortedBlogs)
  })
})

describe('POST /api/blogs', () => {
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
    expect(res.body).toMatchObject({ likes: 0 })
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

describe('DELETE /api/blogs/:id', () => {
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


describe('UPDATE /api/blogs/:id', () => {
  test('updating a valid id returns 200 OK', async () => {
    const blogs = await helper.getAllBlogs()
    const validFirstId = blogs[0].id
    const likesToUpdate = { likes: 40 }

    // login first
    const respond = await api.post('/api/login').send(seedData.users[0])
    // update likes
    await api
      .put(`/api/blogs/${validFirstId}`)
      .auth(respond.body.token, { type: 'bearer' })
      .send(likesToUpdate)
      .expect(200)
  })
})

afterAll(() => {
    sequelize.close()
})