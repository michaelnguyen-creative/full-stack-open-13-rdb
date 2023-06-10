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

describe("GET /api/users", () => {
  test("returns a 200 OK & users are returned as JSON", async () => {
    const res = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    // log res.body
    // console.log("res.body", res.body);
  });
  test("each user shows the blogs they created", async () => {
    const res = await api.get("/api/users");
    // log res.body
    // console.log("res.body", res.body);
    expect(res.body[0].blogs).toMatchObject(data.blogs);
  });
});

// test individual user /api/users/:id endpoint
describe("GET /api/users/:id", () => {
  beforeEach(async () => {
    // insert into readinglist table
    await testHelper.insertIntoReadingList();
  });

  // returns a 200 OK & user is returned as JSON
  test("returns a 200 OK & user is returned as JSON", async () => {
    // set userId to 1
    const userId = 1;
    // send a get request to /api/users/:id
    await api.get(`/api/users/${userId}`).expect(200);
  });

  // shows blogs that the user added to their reading list
  test("shows the blogs they added to their reading list", async () => {
    // get first user from database
    const user = await testHelper.getFirstUser();

    // send a get request to /api/users/:id
    const res = await api.get(`/api/users/${user.id}`);
    // log res.body as a json string
    // console.log("res.body", JSON.stringify(res.body));
    // expect res.body.readings to have length of data.blogs.length - 1
    expect(res.body.readings).toHaveLength(data.blogs.length);
  });

  // each blog shows info about the reading list it belongs to
  test("each blog shows info about the reading list it belongs to", async () => {
    // get first user from database
    const user = await testHelper.getFirstUser();
    // declare readingListObj with default values: id & read
    const readingListObj = {
      id: expect.any(Number),
      read: false,
    };
    // get first user info
    const res = await api.get(`/api/users/${user.id}`);
    // expect res.body.readings[0].readinglist to include readingListObj
    expect(res.body.readings[0].readinglist).toEqual(
      expect.objectContaining(readingListObj)
    );
  });
  // with query string read=true/flase, returns only blogs that are read/unread
  describe("?read=true/false", () => {
    test("returns only blogs that are read", async () => {
      // get the first user in the database
      const firstUser = await testHelper.getFirstUser();
      const user = data.users.find((user) => user.username === firstUser.username);
      // Logins as user 1
      const loginRes = await api
        .post("/api/login")
        .send(user)
        .expect(200);
      // log loginRes.body as json string
      // console.log("loginRes.body", JSON.stringify(loginRes.body, null, 2));
      // Get first record of ReadingList
      const readingList = await testHelper.getFirstReadingList();
      // log readingList 
      // console.log("readingList", readingList);
      // Update the first readinglist record to be read
      const updateRes = await api
        .put(`/api/readinglists/${readingList.id}`)
        .auth(loginRes.body.token, { type: "bearer" })
        .send({ read: true })
        .expect(200);
      // log updateRes.body as json string
      // console.log("updateRes.body", JSON.stringify(updateRes.body, null, 2));
      
      // // Get user info who updated the reading list with query string read=true
      const res = await api.get(`/api/users/${updateRes.body.userId}?read=true`);
      // log res.body as json string
      // console.log("res.body", JSON.stringify(res.body, null, 2));

      // expect res.body.readings to have length of 1
      expect(res.body.readings).toHaveLength(1);
      // & include only the first blog with readinglist.read: true in the database
      expect(res.body.readings[0].readinglist).toEqual(
        expect.objectContaining({
          read: true,
        })
      );
    });

    test("returns only blogs that are unread", async () => {
      // get first user from database
      const user = await testHelper.getFirstUser();
      // get info of the first user with readinglist: read=true
      const res = await api.get(`/api/users/${user.id}?read=false`);
      // log res.body as json string
      // console.log("res.body", JSON.stringify(res.body, null, 2));
      // expect res.body.readings to have length of data.blogs.length - 1
      expect(res.body.readings).toHaveLength(data.blogs.length);
    });
  });
});

describe("POST /api/users", () => {
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
