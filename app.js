require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const path = require('path');
const passport = require("passport");
const flash = require("connect-flash");
const isUserLoggedIn = require('./middleware/index.middleware');

const localStategy = require("./configs/passport.config");
const googleStrategy = require("./configs/passportGoogle.config");
const facebookStrategy = require("./configs/passportFacebook.config");

// Db cnx
require("./configs/db.config");


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// session config
require("./configs/session.config")(app);

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());

// Passport stuff to make app work with passport
app.use(passport.initialize());
app.use(passport.session());
require("./configs/serialize.config");
passport.use(localStategy);
passport.use(googleStrategy);
passport.use(facebookStrategy);
// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'LANGOUT';

// Routes middleware goes here
app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/auth.routes'));
app.use('/', isUserLoggedIn,require('./routes/user.routes'));
app.use('/', isUserLoggedIn,require('./routes/post.routes'));

module.exports = app;
