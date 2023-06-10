const { Blog } = require('../models')
const { sequelize } = require('../utils/connectPostgres')

const authorsRouter = require('express').Router()

authorsRouter.get('/', async (_req, res) => {
    const authors = await Blog.findAll({
        // display each author's number of articles and total likes
        attributes: [
            'author',
            [sequelize.fn('count', sequelize.col('id')), 'articles'],
            [sequelize.fn('sum', sequelize.col('likes')), 'likes'],
        ],
        group: ['author'],
        // sort by total likes in descending order
        order: [[sequelize.fn('sum', sequelize.col('likes')), 'DESC']],
    })

    res.json(authors)
})

module.exports = authorsRouter