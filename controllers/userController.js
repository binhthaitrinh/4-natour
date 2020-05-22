const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
// );

const filterObj = (obj, ...allowedFields) => {
  // allowedFields is array containing extra arg
  const newObj = {};

  // loop through obj
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

const updateMe = catchAsync(async (req, res, next) => {
  // 1)  Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updateMyPassword',
        400
      )
    );
  }

  // 2) Update user document
  // new is to return new updated value
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  console.log('UPDATEEEEEEEEEEE');

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use signup instead',
  });
};

const getAllUsers = factory.getAll(User);
const deleteUser = factory.deleteOne(User);
const getUser = factory.getOne(User);

// Do not update passwords with this
const updateUser = factory.updateOne(User);

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  updateMe,
  deleteMe,
  getMe,
};
