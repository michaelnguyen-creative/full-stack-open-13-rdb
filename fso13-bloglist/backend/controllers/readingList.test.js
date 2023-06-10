const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const testHelper = require("../utils/testHelper");
const data = require("../postgres/seed");
const { sequelize, connectToPostgres } = require("../utils/connectPostgres");

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

// Updating read status of a blog in a user's reading list
// PUT /api/readinglists/:id
describe("PUT /api/readinglists/:id", () => {
  // before each test, insert into readinglist table
  beforeEach(async () => {
    // insert into readinglist table
    await testHelper.insertIntoReadingList();
  });
  test("returns 200 & updated read status", async () => {
    // user login as the first user in the database
    const loginRes = await api
      .post("/api/login")
      .send(data.users[0])
      .expect(200);

    // Get readingId from the first reading in the database
    const { id: readingId } = await testHelper.getFirstReadingList();
    // Making put request to /api/readinglists/:id with readingId
    const updatedRes = await api
      .put(`/api/readinglists/${readingId}`)
      .auth(loginRes.body.token, { type: "bearer" })
      .send({ read: true })
      .expect(200);
    // Check that read status is updated
    expect(updatedRes.body.read).toBe(true);
  });

  test("returns 401 & error message if user is not logged in", async () => {
    // Get readingId from the first reading in the database
    const { id: readingId } = await testHelper.getFirstReadingList();
    // Making put request to /api/readinglists/:id with readingId
    const updatedRes = await api
      .put(`/api/readinglists/${readingId}`)
      .send({ read: true })
      .expect(401);

    // Check that error message is returned
    expect(updatedRes.body.error).toBe(
        "token missing"
    );
  });
});

afterAll(() => {
  sequelize.close();
});
