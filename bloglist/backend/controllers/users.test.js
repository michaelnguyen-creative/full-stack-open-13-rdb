const supertest = require('supertest')
const app = require('../app')
const { User } = require('../postgres/models')

const api = supertest(app)

// beforeAll(() => {
//   initPostgres()
// })

// const blogs = [
//   {
//     title: 'React patterns',
//     author: 'Michael Chan',
//     url: 'https://reactpatterns.com/',
//     likes: 7,
//   },
//   {
//     title: 'Go To Statement Considered Harmful',
//     author: 'Edsger W. Dijkstra',
//     url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
//     likes: 5,
//   },
//   {
//     title: 'Canonical string reduction',
//     author: 'Edsger W. Dijkstra',
//     url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
//     likes: 12,
//   },
//   {
//     title: 'First class tests',
//     author: 'Robert C. Martin',
//     url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
//     likes: 10,
//   },
//   {
//     title: 'TDD harms architecture',
//     author: 'Robert C. Martin',
//     url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
//     likes: 0,
//   },
//   {
//     title: 'Type wars',
//     author: 'Robert C. Martin',
//     url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
//     likes: 2,
//   },
// ]

const users = [
  {
    username: "test",
    password: "password",
    name: "Tester"
  },
  {
    username: "michael",
    password: "password",
    name: "Michael"
  },
  {
    username: "john",
    password: "password",
    name: "John"
  }
]

beforeEach(async () => {
  await User.destroy({
    truncate: true,
  })
  await User.bulkCreate(users)
})

test.only('get /users returns some data', () => {
  api.get('/users').expect(200)
})