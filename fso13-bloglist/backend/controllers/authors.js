const { Blog } = require('../postgres/models')
const { sequelize } = require('../postgres/init')

const authorsRouter = require('express').Router()

authorsRouter.get('/', async (req, res) => {
    const authors = await Blog.findAll({
        attributes: [
            'author',
            [sequelize.fn('count', sequelize.col('id')), 'articles'],
            [sequelize.fn('sum', sequelize.col('likes')), 'likes'],
        ],
        group: ['author'],
        order: [[sequelize.fn('sum', sequelize.col('likes')), 'DESC']],
    })

    res.json(authors)
})

module.exports = authorsRouter