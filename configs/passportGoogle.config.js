const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.model");

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    profileFields: ['email', 'displayName', 'photos'],
  }, (accessToken, refreshToken, profile, done) => {
    
    User
      .findOne({ googleId: profile.id })
      .then((foundUser) => {
        
        if (foundUser) {
          done(null, foundUser);
          return;
        }
        return User
          .create({
            fullName: profile.displayName,
            imageUrl: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg',
            googleId: profile.id,
          });
      }).then((newUser) => {
        done(null, newUser);
      })
      .catch((findErr) => done(findErr))
  }
);

module.exports = googleStrategy;

