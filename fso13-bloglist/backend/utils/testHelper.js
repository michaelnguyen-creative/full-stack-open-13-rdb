const bcrypt = require("bcrypt");
const { Blog, User, ReadingList, Session } = require("../models");
const data = require("../postgres/seed");

const getAllBlogs = async () => Blog.findAll();
const getAllUsers = async () => User.findAll();
const getUserById = async (id) => User.findByPk(id);
const getBlogById = async (id) => Blog.findByPk(id);
// implement getReadingById
const getReadingById = async (id) => ReadingList.findByPk(id);
// implement getTokenByToken(token)
const getTokenByToken = async (token) => Session.findByPk(token);
// implement getFirtUser from db
const getFirstUser = async () => User.findOne();
// implement getFirtBlog from db
const getFirstBlog = async () => Blog.findOne();
// implement getFirstReadingList from db
const getFirstReadingList = async () => ReadingList.findOne();

const setupDb = async () => {
  // Seed data:
  try {
    // User table prep
    // Truncate table first, table with foreign key relation requires `cascade` set to true
    await User.destroy({ truncate: true, cascade: true });
    const firstUser = data.users[0];
    const passwordHash = await bcrypt.hash(firstUser.password, 10);
    // Insert a new user
    const user = await User.create({
      username: firstUser.username,
      name: firstUser.name,
      passwordHash,
    });

    // Blog table prep
    await Blog.destroy({ truncate: true, cascade: true });
    const blogs = data.blogs.map((item) => ({ ...item, userId: user.id }));
    await Blog.bulkCreate(blogs, { validate: true });
  } catch (error) {
    console.log("error while setting up db for testing:", error);
    process.exit(1)
  }
};

// insert into readinglist table
const insertIntoReadingList = async () => {
  // first user from the db adds all blogs (from seed.js) to their reading list
  try {
    // Truncate table first, table with foreign key relation requires `cascade` set to true
    await ReadingList.destroy({ truncate: true, cascade: true });
    // Get all blogs
    const blogs = await Blog.findAll();
    // Get first user
    const user = await User.findOne()
    // Create an array of reading list objects
    const readingList = blogs.map((blog) => ({
      blogId: blog.id,
      userId: user.id,
    }));
    // Insert the array of reading list objects into the reading list table
    await ReadingList.bulkCreate(readingList, { validate: true });
  } catch (error) {
    // log error
    console.log("error while inserting into reading list:", error);
    process.exit(1)
  }
};

module.exports = {
  getAllBlogs,
  getAllUsers,
  getUserById,
  getBlogById,
  getReadingById,
  getTokenByToken,
  getFirstUser,
  getFirstBlog,
  getFirstReadingList,
  setupDb,
  insertIntoReadingList,
};
