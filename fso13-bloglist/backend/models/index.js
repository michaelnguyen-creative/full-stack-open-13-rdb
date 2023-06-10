const User = require("./user");
const Blog = require("./blog");
const ReadingList = require("./readingList");
const Session = require("./session");

// Define one to many relationship between User:Blogs
User.hasMany(Blog);
Blog.belongsTo(User);

// Define many-to-many relationship between User:Blog --> ReadingList
User.belongsToMany(Blog, { through: ReadingList, as: "readings" });
Blog.belongsToMany(User, { through: ReadingList });

// Define one-to-one relationship between User:Session
User.hasOne(Session);
Session.belongsTo(User);

module.exports = { Blog, User, ReadingList, Session };
