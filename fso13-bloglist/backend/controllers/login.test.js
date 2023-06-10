const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const testHelper = require("../utils/testHelper");
const data = require("../postgres/seed");
const { sequelize, connectToPostgres } = require("../utils/connectPostgres");

beforeAll(async () => {
  await connectToPostgres();
});

afterAll(() => {
  sequelize.close();
});

beforeEach(async () => {
  await testHelper.setupDb();
});

// POST /api/login
describe("POST /api/login", () => {
  // When user login, a token is generated and sent back to the user
  test("valid user returns 200 & token", async () => {
    const res = await api
        .post("/api/login").send(data.users[0])
        // .expect(200);

    // log the response body
    console.log(res.body);
    expect(res.body.token).toBeDefined();
  });
  // When user login with invalid username, an error is returned
  test("invalid username returns 400 & error message", async () => {
    const res = await api
      .post("/api/login")
      .send({ ...data.users[0], username: "invalid" })
      .expect(400);
    expect(res.body.error).toBe("invalid username");
  });
  // When user login, token will be stored in a postgres table
  test("token is stored in postgres", async () => {
    const res = await api.post("/api/login").send(data.users[0]).expect(200);
    const { token } = res.body;
    const storedToken = await testHelper.getTokenByToken(token);
    expect(storedToken.id).toBe(token);
  });
});
