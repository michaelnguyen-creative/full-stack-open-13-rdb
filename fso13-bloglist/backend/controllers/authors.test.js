const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const testHelper = require('../utils/testHelper')
const { sequelize, connectToPostgres } = require('../utils/connectPostgres')

beforeAll(async () => {
    await connectToPostgres()
})

beforeEach(async () => {
    await testHelper.setupDb()
})

describe('GET /api/authors', () => {
    test('returns authors in the correct format', async () => {
        const response = await api.get('/api/authors')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        // console.log('response.body', response.body);
        expect(response.body).toEqual([
            { author: 'Edsger W. Dijkstra', articles: '2', likes: '17' },
            { author: 'Robert C. Martin', articles: '3', likes: '12' },
            { author: 'Michael Chan', articles: '1', likes: '7' }
        ])
    })
})

afterAll(() => {
    sequelize.close()
})