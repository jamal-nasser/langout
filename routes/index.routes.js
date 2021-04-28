const express = require('express');
const router = express.Router();

const Post = require("../models/Post.model");

/* GET home page */
router.get('/', (req, res) => res.render('index'));

router.get("/posts", (req, res, next) => {
  Post
    .find({})
    .populate("owner")
    .then((allPostsResults) => {
      
      if (req.user) {
        allPostsResults.forEach((postItem) => {
          if (postItem.owner.equals(req.user)) {
            postItem.isOwner = true;
         }
        });
      }

      res
        .status(200)
        .render("posts/posts-list", { posts: allPostsResults, user: req.user });
    })
    .catch((findErr) => next(findErr));
});

module.exports = router;
