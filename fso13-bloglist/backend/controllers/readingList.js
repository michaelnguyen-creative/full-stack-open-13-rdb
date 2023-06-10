// create new router for reading list
const readingListRouter = require('express').Router();
const { ReadingList } = require('../models');
const middleware = require('../utils/middleware');

// add a new blog to reading list
readingListRouter.post('/', async (req, res) => {
    const { blogId, userId } = req.body;
    // insert blogId and userId into reading list
    const readingList = await ReadingList.create({ blogId, userId });
    // return reading list
    res.status(201).json(readingList);
})

// All routes below this middleware require a valid session
readingListRouter.use(middleware.sessionValidator)

// update read status of a blog in a user's reading list
readingListRouter.put('/:id', async (req, res) => {
    // Check if user is logged in
    if (!req.user) {
        return res.status(401).json({ error: 'You must be logged in to update read status of a blog in your reading list' });
    }
    // Get readingId from the request params
    const { id: readingId } = req.params;
    // Get read status from the request body
    const { read } = req.body;
    // Update read status of a blog in a user's reading list
    const updatedReadingList = await ReadingList.update({ read }, {
        where: {
            id: readingId,
            userId: req.user.id
        },
        returning: true
    });
    // Return updated reading list
    res.status(200).json(updatedReadingList[1][0]);
})

module.exports = readingListRouter;