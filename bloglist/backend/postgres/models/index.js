const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readingList");

// Define relationships between models
User.hasMany(Blog);
Blog.belongsTo(User);

// Define many-to-many relationship between User and Blog
User.belongsToMany(Blog, { through: ReadingList, as: "readings" });
Blog.belongsToMany(User, { through: ReadingList, as: 'readers' });

module.exports = { Blog, User, ReadingList };
