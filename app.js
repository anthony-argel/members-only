var createError = require('http-errors');
var express = require('express');
const session = require("express-session");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require('bcryptjs');

require('dotenv').config()
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const User = require('./models/user');

//db
let mongoose = require('mongoose');
var mongoDB = process.env.DB_URL;
mongoose.connect(mongoDB, {useNewUrlParser:true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//passport
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({username:username}, (err, user) => {
    if(err) {return done(err);};
    if(!user) {
      return done(null, false, {message:"Incorrect username"});
    }
    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        // passwords match! log user in
        return done(null, user)
      } else {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
      }
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.use(express.urlencoded({ extended: false }));


// note, works here, but not if I put in index.js.
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
