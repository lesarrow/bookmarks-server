const express = require('express');

const uuid = require('uuid/v4');
const logger = require('../logger');
const bookmarks = require('../store');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter.route('/bookmarks')
    .get((req,res) => {
        res.status(200).json(bookmarks);
    })
    .post(bodyParser, (req,res) => {

        const {title, url, description="", rating=1} = req.body;
        const ratingNumber = Number(rating);

        if (!title) {

            logger.error("Title is required");
            return res.status(400).send("Invalid data");
        }
        
        if (!url) {
            logger.error("URL is required");
            return res.status(400).send("Invalid data");
        }

        if ((rating == NaN) || (rating < 1) || (rating > 10)) {

            if (rating == NaN)
                logger.error("Rating is not a number");
            else logger.error("Rating must be between 1 and 10");

            return res.status(400).send("Rating must be a number between 1 and 10");
        }

        const newBookmark = {
            id: uuid(),
            title: title,
            url: url,
            rating: rating
        }

        bookmarks.push(newBookmark);

        logger.info(`Card with id ${newBookmark.id} created`);
        res.status(201).end();
    });


bookmarkRouter.route('/bookmarks/:id')
    .get((req,res) => {

        const {id} = req.params;
        bookmark = bookmarks.find(bookmark => {
            bookmark.id === id;
        });

        if (!bookmark) {

            logger.error(`Bookmark with id ${id} not found`);
            return res.status(404).send("Bookmark not found");
        }
        
        res.json(bookmark);
    })
    .delete((req,res) => {

        const {id} = req.params;
        const index = bookmarks.findIndex(bookmark => {
            return bookmark.id === id;
        });

        if (index === -1) {

            logger.error(`Bookmark with id ${id} not found`);
            return res.status(404).send("Bookmark not found");
        }

        bookmarks.splice(index, 1);
        logger.info(`Bookmark with id ${id} successfully deleted`);
        res.status(204).end();

    });

module.exports = bookmarkRouter;