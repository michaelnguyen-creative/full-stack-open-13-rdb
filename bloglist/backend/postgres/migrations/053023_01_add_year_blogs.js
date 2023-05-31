const { DataTypes } = require('sequelize');

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('blogs', 'year', {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1991,
            validate: {
                min: 1991,
                max: new Date().getFullYear(),
            },
        });
    },

    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('blogs', 'year');
    },
};

// // FILEPATH: /Users/michaelng/Data/full-stack-open-rdb/bloglist/backend/models/blog.js
// 'use strict';
// const { Model } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//     class Blog extends Model {
//         static associate(models) {
//             // define association here
//         }
//     }
//     Blog.init(
//         {
//             title: DataTypes.STRING,
//             author: DataTypes.STRING,
//             url: DataTypes.STRING,
//             likes: DataTypes.INTEGER,
//             year: {
//                 type: DataTypes.INTEGER,
//                 allowNull: false,
//                 defaultValue: 1991,
//                 validate: {
//                     min: 1991,
//                     max: new Date().getFullYear(),
//                 },
//             },
//         },
//         {
//             sequelize,
//             modelName: 'Blog',
//         }
//     );
//     return Blog;
// };

// FILEPATH: /Users/michaelng/Data/full-stack-open-rdb/bloglist/backend/controllers/blogs.js
// const blogsRouter = require('express').Router();
// const Blog = require('../models/blog');

// blogsRouter.post('/', async (request, response) => {
//     const body = request.body;

//     const blog = new Blog({
//         title: body.title,
//         author: body.author,
//         url: body.url,
//         likes: body.likes,
//         year: body.year,
//     });

//     const savedBlog = await blog.save();
//     response.json(savedBlog);
// });

// blogsRouter.put('/:id', async (request, response) => {
//     const body = request.body;

//     const blog = {
//         title: body.title,
//         author: body.author,
//         url: body.url,
//         likes: body.likes,
//         year: body.year,
//     };

//     const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
//         new: true,
//     });
//     response.json(updatedBlog);
// });

// module.exports = blogsRouter;
