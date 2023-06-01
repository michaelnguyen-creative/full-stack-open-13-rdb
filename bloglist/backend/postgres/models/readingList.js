const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../init');

class ReadingList extends Model {}

module.exports = ReadingList.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    blogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'reading_list'
});
  
//   const Blog = sequelize.define('blog', {
//     id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true
//     },
    
//   });
  
//   ReadingList.afterCreate(async (readingList, options) => {
//     const blog = await Blog.findByPk(readingList.blogId);
//     if (blog) {
//       await blog.update({ read: false });
//     }
//   });

// Model.define syntax:
// {
//     hooks: {
//         async beforeCreate(readingList) {
//             const blog = await Blog.findByPk(readingList.blogId);
//             if (!blog || blog.read) {
//                 throw new Error('Blog is already read or does not exist');
//             }
//         }
//     }
// }