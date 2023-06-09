const Blog = require("./Blog");
const User = require("./User");
const ReadingList = require("./ReadingList");

// Define one to many relationship between User:Blogs
User.hasMany(Blog);
Blog.belongsTo(User);

// Define many-to-many relationship between User:Blog through ReadingList
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' });
Blog.belongsToMany(User, { through: ReadingList });

module.exports = { Blog, User, ReadingList };
