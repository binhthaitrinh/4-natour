const express = require('express');

const {
  getAllUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser,
  updateMe,
  deleteMe,
  uploadUserPhoto,
  getMe,
  resizeUserPhoto,
} = require('../controllers/userController');

const authController = require('../controllers/authController');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.get('/logout', authController.logout);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

// Middleware runs in sequence, thus does not affect previous commands.
// protect every routes after this
userRouter.use(authController.protect);

userRouter.patch('/updateMyPassword', authController.updatePassword);

userRouter.delete('/deleteMe', authController.protect, deleteMe);

// photo is the field in the form we will use ip upload image
userRouter.patch(
  '/updateMe',
  uploadUserPhoto,
  resizeUserPhoto,
  authController.protect,
  updateMe
);
userRouter.get('/me', authController.protect, getMe, getUser);

userRouter.use(authController.restrictTo('admin'));

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

module.exports = userRouter;
