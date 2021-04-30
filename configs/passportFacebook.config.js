const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User.model");

const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/auth/facebook/callback",
    proxy: true,
  }, (accessToken, refreshToken, profile, done) => {

    User
      .findOne({ facebookId: profile.id })
      .then((foundUser) => {

        if (foundUser) {
          done(null, foundUser);
          return;
        }
        return User
          .create({
            fullName: profile.displayName,
            imageUrl: "/images/unknown-user.jpeg",
            facebookId: profile.id,
          });
      }).then((newUser) => {
        done(null, newUser);
      })
      .catch((findErr) => done(findErr))
  }
);

module.exports = facebookStrategy;

