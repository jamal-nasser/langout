const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/User.model");
const saltRounds = 10;
const passport = require("passport");
const fileUploader = require("../configs/cloudinary.config");

router.get('/signup', (_, res) => {
  res.render('auth/signup');
});

router.post('/signup',
  fileUploader.single("imageUrl"),
  (req, res, next) => {
    const { fullName, email, password, learningLanguage, speakingLanguage } = req.body;
    req.body.speakingLanguage[0].toUpperCase();
    req.body.learningLanguage[0].toUpperCase();

    if (!fullName || !email || !password || !learningLanguage || !speakingLanguage) {
    res.render('auth/signup', { errorMessage: 'Indicate Full name, email, password and languages' });
    return;
  }

  const emailFormatRegex = /^\S+@\S+\.\S+$/;
  if (!emailFormatRegex.test(email)) {
    res.status(200).render("auth/signup", { errorMessage: "Email needs to be similar to email@email.com" });
    return;
  }

  const passwordFormatRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!passwordFormatRegex.test(password)) {
    res.status(200).render("auth/signup", { errorMessage: "Password needs to have at least 8 characters, 1 lowercase, 1 uppercase and 1 number" });
    return;
  }
    
    let imageUrl = "/images/unknow-user.jpeg";

    if (req.file) {
      const { path } = req.file;
      imageUrl = path;
    }
  
  User
    .findOne({ email })
    .then((userResult) => {
     
      if (userResult) {
        res.render('auth/signup', { errorMessage: 'The email already exists' });
        return;
      }

      bcrypt
        .hash(password, saltRounds)
        .then((passwordHash) => {
          return User
            .create({ fullName, email, passwordHash, learningLanguage, speakingLanguage ,imageUrl});
        })
            .then((newUser) => {
          req.login(newUser, (err) => {
            if (err) {
              res.status(500).render('auth/signup', { errorMessage: 'Login failed after sign up' });
              return;
            }
          });
          res.redirect('/profile')
        })
        .catch((hashErr) => {
          next(hashErr);
        })
    });
});

router.get('/login', (req, res) => {
  const flashMessage = req.flash("error");
  res.render('auth/login', { message: flashMessage });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/",
    failureFlash: true,
  })
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook")
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: `/profile`,
    failureRedirect: "/",
    failureFlash: true,
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;



