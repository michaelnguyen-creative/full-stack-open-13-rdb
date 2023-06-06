const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const testHelper = require("../utils/testHelper");

const data = require("../postgres/seed");
const { sequelize, connectToPostgres } = require("../postgres/init");

beforeAll(async () => {
  await connectToPostgres();
});

beforeEach(async () => {
  await testHelper.setupDb();
});

describe("GET /api/users", () => {
  test("returns a 200 OK & users are returned as JSON", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("each user shows the blogs they created", async () => {
    const res = await api.get("/api/users");
    // log res.body
    console.log("res.body", res.body);
    expect(res.body[0].blogs).toMatchObject(data.blogs);
  });
});

// test individual user /api/users/:id endpoint
describe("GET /api/users/:id", () => {
  test("returns a 200 OK & user is returned as JSON", async () => {
    // set userId to 1
    const userId = 1;
    // send a get request to /api/users/:id
    await api.get(`/api/users/${userId}`).expect(200);
  });
  // shows blogs that the user added to their reading list
  test("shows the blogs they added to their reading list", async () => {
    // Get blogId from the first blog in the database
    const { id: blogId } = await testHelper.getBlogById(1);
    // Get userId from the first user in the database
    const { id: userId } = await testHelper.getUserById(1);
    // User 1 adds blog 1 to their reading list
    await api.post("/api/readinglists").send({ blogId, userId }).expect(201);

    // send a get request to /api/users/:id
    const res = await api.get(`/api/users/${userId}`);
    // expect res.body.readings to include the first blog in the database
    expect(res.body.readings[0]).toEqual(
      expect.objectContaining(data.blogs[0])
    );
  });
  // each blog shows info about the reading list it belongs to
  test.only("each blog shows info about the reading list it belongs to", async () => {
    // Get blogId from the first blog in the database
    const { id: blogId } = await testHelper.getBlogById(1);
    // Get userId from the first user in the database
    const { id: userId } = await testHelper.getUserById(1);
    // User 1 adds blog 1 to their reading list
    await api.post("/api/readinglists").send({ blogId, userId }).expect(201);

    // declare readingListObj with default values: id & read
    const readingListObj = {
      id: expect.any(Number),
      read: false,
    };
    // send a get request to /api/users/:id
    const res = await api.get(`/api/users/${userId}`);
    // expect res.body.readings[0].readinglist to include readingListObj
    expect(res.body.readings[0].readinglist).toEqual(
      expect.objectContaining(readingListObj)
    );
  });
});

describe("user creation validators", () => {
  test("successfully create a new user with status code 201", async () => {
    await api.post("/api/users").send(data.users[1]).expect(201);
  });
  test("invalid users will not be created, status code 400 & proper error message returned", async () => {
    const invalidUsers = [
      {
        username: "test-admin@gmail.com",
        name: "admin",
        password: "t3",
      },
      {
        username: "test-admin",
        name: "admin",
        password: "t3st@adm1n",
      },
    ];

    const resOne = await api
      .post("/api/users")
      .send(invalidUsers[0])
      .expect(400);
    // console.log('respond', res.body)
    expect(resOne.body.error).toBe(
      "password must be at least 3 characters long"
    );

    const resTwo = await api
      .post("/api/users")
      .send(invalidUsers[1])
      .expect(400);
    expect(resTwo.body.error).toContain("Invalid username email");

    const allUsers = await testHelper.getAllUsers();
    expect(allUsers).not.toContainEqual(invalidUsers);
  });

  test("valid users return 201 Created", async () => {
    const validUser = data.users[0];

    await api.post("/api/users").send(validUser).expect(201);
  });
});

afterAll(() => {
  sequelize.close();
});
