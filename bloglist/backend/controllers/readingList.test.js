const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const testHelper = require("../utils/testHelper");
// const data = require("../postgres/data");
const { sequelize, connectToPostgres } = require("../postgres/init");

beforeAll(async () => {
  await connectToPostgres();
});

beforeEach(async () => {
  await testHelper.setupDb();
});

describe("POST /api/readingList", () => {
    test("returns 201 & default value 'read: false'", async () => {
        // Get blogId from the first blog in the database
        const { id: blogId } = await testHelper.getBlogById(1);
        // Get userId from the first user in the database
        const { id: userId } = await testHelper.getUserById(1);
        // Making post request to /api/readingList with blogId and userId
        const res = await api
            .post("/api/readinglists")
            .send({ blogId, userId })
            .expect(201);
        // Check that default value 'read: false'
        expect(res.body.read).toBe(false);
    });
});

afterAll(() => {
  sequelize.close();
});
