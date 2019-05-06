var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var indexRouter = require('./routes/index');
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')

var app = express();

app.use(bodyParser.json())
app.use(expressValidator())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//Initialize mongoose
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

//Initialize firebase client
var firebase = require("firebase/app");
var firebaseConfig = {
  apiKey: process.env.FIREBASE_CLIENT_API_KEY,
  authDomain: "iaasuniandes.firebaseapp.com",
  databaseURL: "https://iaasuniandes.firebaseio.com",
  projectId: "iaasuniandes",
  storageBucket: "iaasuniandes.appspot.com",
  messagingSenderId: "206755752639"
};
firebase.initializeApp(firebaseConfig);

//Initialize firebase admin
var admin = require("firebase-admin");
var serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iaasuniandes.firebaseio.com"
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
