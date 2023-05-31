const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { getAllUsers, setupDb } = require('../utils/testHelper')
const seedData = require('../postgres/seed')
const { sequelize, connectToPostgres } = require('../postgres/init')

beforeAll(async () => {
  await connectToPostgres()
})

beforeEach(async () => {
  await setupDb()
})

describe('GET /api/users', () => {
  test('returns a 200 OK & users are returned as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('each user shows the blogs they created', async () => {
    const res = await api.get('/api/users')
    expect(res.body[0].Blogs).toMatchObject(seedData.blogs)
  })
})


describe('user creation validators', () => {
  test('successfully create a new user with status code 201', async () => {
    await api
      .post('/api/users')
      .send(seedData.users[1])
      .expect(201)
  })
  test('invalid users will not be created, status code 400 & proper error message returned', async () => {
    const invalidUsers = [
      {
        username: 'test-admin@gmail.com',
        name: 'admin',
        password: 't3',
      },
      {
        username: 'test-admin',
        name: 'admin',
        password: 't3st@adm1n',
      },
    ]

    const resOne = await api
      .post('/api/users')
      .send(invalidUsers[0])
      .expect(400)
    // console.log('respond', res.body)
    expect(resOne.body.error).toBe('password must be at least 3 characters long')

    const resTwo = await api
      .post('/api/users')
      .send(invalidUsers[1])
      .expect(400)
    expect(resTwo.body.error).toContain('Invalid username email')

    const allUsers = await getAllUsers()
    expect(allUsers).not.toContainEqual(invalidUsers)
  })

  test('valid users return 201 Created', async () => {
    const validUser = seedData.users[0]

    await api
      .post('/api/users')
      .send(validUser)
      .expect(201)
  })
})

afterAll(() => {
    sequelize.close()
})