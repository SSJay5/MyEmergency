"use strict";

var path = require('path');

var express = require('express');

var morgan = require('morgan');

var rateLimit = require('express-rate-limit');

var helmet = require('helmet');

var mongoSanitize = require('express-mongo-sanitize');

var xss = require('xss-clean');

var hpp = require('hpp');

var cookieParser = require('cookie-parser');

var compression = require('compression');

var AppError = require('./utils/appError');

var globalErrorHandler = require('./controllers/errorController');

var userRouter = require('./routes/userRoutes');

var emergencyRouter = require('./routes/emergencyRoutes');

var viewRouter = require('./routes/viewRoutes'); //Start Expess APP


var app = express();
app.set('port', process.env.PORT || 3000);
app.use(helmet({
  contentSecurityPolicy: false
}));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // 1) GLOBAL MIDDLEWARES
// Serving static files

app.use(express["static"](path.join(__dirname, 'public'))); // Set security HTTP headers
// Development logging

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} // Limit requests from same API


var limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter); // Body parser, reading data from body into req.body

app.use(express.json({
  limit: '10kb'
}));
app.use(express.urlencoded({
  extended: true,
  limit: '10kb'
}));
app.use(cookieParser());
app.use(compression()); // Data sanitization against NoSQL query injection

app.use(mongoSanitize()); // Data sanitization against XSS

app.use(xss());
app.use(hpp({
  whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/emergencies', emergencyRouter);
app.all('*', function (req, res, next) {
  next(new AppError("Can't find ".concat(req.originalUrl, " on this server!!!"), 404));
});
app.use(globalErrorHandler);
module.exports = app;