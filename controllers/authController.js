const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2. check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  const correct = user.correctPassword(password, user.password);

  if (!user || !correct) {
    // 401 is unauthorized
    return next(new AppError('Incorrect email or password!', 401));
  }
  // 3. If ok, then JWT back to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
