require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// more dependencies
const passportSetup = require('./config/setPassport');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/authentication');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// setup cookie
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['abcdefghijklmnopqrstuvwxyz']
}))

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter);

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


const dbURI = process.env.DBURI
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log('connected to mongoDB')
  app.listen(3000, () => {
    console.log('listening to 3000')
  })
})

module.exports = app;
