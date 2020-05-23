const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// set security http headers
app.use(helmet());

// 1)GLOBAL  MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  // allow 100 req from the same IP in 1 hour
  windowMs: 1 * 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

// only limit to route with /api
app.use('/api', limiter);

// Middleware
// app.use is middleware
// body parser middleware
// reading data from body into req.body
// limit data from body to 10kb
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// parse data from URL encoded form
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
// clean any user input from malicious HTML code
app.use(xss());

app.use((req, res, next) => {
  console.log('Hello from middleware');

  next();
});

// 3. ROUTE
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
// Only reach here if not caught in any about routers
// meaning routes we haven't defined
// giberish routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  // const err = new Error(`Canot find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // if next() has an argument, then it will assume there will be
  // error and jump start to global error handler
  // skip any other middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
