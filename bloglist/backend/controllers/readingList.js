// create new router for reading list
const readingListRouter = require('express').Router();
const { ReadingList } = require('../postgres/models');

// add a new blog to reading list
readingListRouter.post('/', async (req, res) => {
    const { blogId, userId } = req.body;
    // insert blogId and userId into reading list
    const readingList = await ReadingList.create({ blogId, userId });
    // return reading list
    res.status(201).json(readingList);
})

module.exports = readingListRouter;