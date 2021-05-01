const { Router } = require('express');
const router = Router();
const isUserLoggedIn = require('../middleware/index.middleware');
const fileUploader = require("../configs/cloudinary.config");
const User = require("../models/User.model");
const nodemailer = require('nodemailer');

router.get('/profile', (req, res) => {
  const { user } = req;
  res.status(200).render('users/profile', { user });
});

router.get('/users/:userId/edit', (req, res) => {
  const { userId } = req.params;

  User
    .findById(userId)
    .then((userResult) => {
      res.status(200).render('users/profile-edit', { userResult, user: req.user });
    })
    .catch((findErr) => {
      console.error(`Error occured when retrieving the profile`)
    })
});

router.post('/users/:userId/edit',
  fileUploader.single("imageUrl"),
  (req, res) => {
    const { userId } = req.params;
    const { fullName, existingImage, learningLanguage, speakingLanguage } = req.body;

    let imageUrl;

    if (req.file) {
      const { path } = req.file;
      imageUrl = path;
    } else {
      imageUrl = existingImage;
    }

    User
      .findByIdAndUpdate(userId, { fullName, imageUrl, learningLanguage, speakingLanguage })
      .then((updatedUser) => {
        res.redirect(`/profile`);
      })
      .catch((updateErr) => {
        console.error(`Error occured when editing the profile: ${updateErr}`)
      })
  });


router.get('/contact/:userId', (req, res, next) => {
  const { user } = req;
  User.findById(req.params.userId).then((foundUser) => {
    res.status(200).render('users/send-email', { email: foundUser.email, user });

  }).catch(err => next(err))

});

router.post('/contact', (req, res, next) => {
  const { email, subject, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const data = {
    from: req.user.email,
    to: email,
    subject: subject,
    text: message,
  };

  transporter
    .sendMail(data)
    .then((info) => {
      res.status(200).render("users/all-profiles", { email, subject, message, info });
    })
    .catch((sendErr) => next(sendErr))

});

router.get("/search", (req, res, next) => {

  User
    .find({})
    .then((allUsersResults) => {
      res
        .status(200)
        .render("users/all-profiles-search", { users: allUsersResults, user: req.user });
    })
    .catch((filterErr) => next(filterErr));
});

router.post("/search", (req, res) => {
  const { userId } = req.params;
  User
    .find({})
    .then((searchedUser) => {

      const filteredUsers = searchedUser.filter((element) => {

        return element.speakingLanguage.toLowerCase() === req.body.search.toLowerCase();

      })
      res.status(200).render('users/all-profiles-search', { filteredUsers })
    })
    .catch((searchErr) => {
      console.error(`Error occured when searching all profile: ${searchErr}`)
    })
});


module.exports = router;