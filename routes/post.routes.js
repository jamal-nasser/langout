const { Router } = require('express');
const router = Router();
const Post = require('../models/Post.model');
const fileUploader = require("../configs/cloudinary.config");

router.get('/create-post', (req, res) => {
  const { user } = req;
  res.status(200).render('posts/post-create', { user });
});

router.post('/create-post',
  fileUploader.single("imageUrl"),
  (req, res, next) => {
  const { title, description } = req.body;
  const { _id } = req.user;

  if (!title || !description ) {
    res.render('posts/post-create', { errorMessage: 'Indicate title and description' });
    return;
  }
    
    let imageUrl = "https://via.placeholder.com/150";

    // Sometimes images aren't added with a room.
    // To take that into consideration, we will first check if there is a req.file
    // if the file is there, add the cloudinary url.
    // Otherwise the default value above will be used for the image
    if (req.file) {
      const { path } = req.file;
      imageUrl = path;
    }
    
  Post
    .create({ title, description, imageUrl, owner: _id})
    .then(() => {
      res.redirect('/posts')
    })
    .catch((createErr) => next(createErr))

});

router.get('/posts/:postId', (req, res) => {
  const { postId } = req.params;

  Post
    .findById(postId)
    .then((postResult) => {
      res.status(200).render('posts/post-details', { postResult, user: req.user });
    })
    .catch((findErr) => {
      console.error(`Error occured when retrieving the post`)
    })
});

router.get('/posts/:postId/edit', (req, res) => {
  const { postId } = req.params;
  
  Post
    .findById(postId)
    .then((postResult) => {
      res.status(200).render('posts/post-edit', { postResult, user: req.user });
    })
    .catch((findErr) => {
      console.error(`Error occured when retrieving the post`)
    })
});

router.post('/posts/:postId/edit',
  fileUploader.single("imageUrl"),
  (req, res) => {
  const { postId } = req.params;
  const { title, description } = req.body;

    let imageUrl = "https://via.placeholder.com/150";

    if (req.file) {
      const { path } = req.file;
      imageUrl = path;
    }

  Post
    .findByIdAndUpdate(postId, { title, description, imageUrl })
    .then((updatedPost) => {
      res.redirect(`/posts/${updatedPost._id}`);
    })
    .catch((findErr) => {
      console.error(`Error occured when editing the post`)
    })
});


router.post('/posts/:postId/delete', (req, res, next) => {
  const { postId } = req.params;
  Post
    .findByIdAndDelete(postId)
    .then(() => {
      res.redirect('/posts')
    })
    .catch((deleteErr)=> done(deleteErr))
});



module.exports = router;