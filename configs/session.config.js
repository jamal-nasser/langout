const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      name: "passportCookie",
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 100000
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 60 * 60 * 24
      })
    }));
};