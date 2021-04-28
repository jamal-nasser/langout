const passport = require("passport");
const User = require("../models/User.model");

// Attach the user to the session, makes it easier to manage user via passport
// req.session.user (before)
// req.user with passport


passport.serializeUser((user, done) => {
  done(null, user._id);
});

// whenver you find the user attach it to the session
passport.deserializeUser((id, done) => {
  User
    .findById(id)
    .then((user)=> done(null, user))
    .catch((findErr) => done(findErr));
});