const express = require('express');
const {
  getAllUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser,
  updateMe,
  deleteMe,
} = require('../controllers/userController');

const authController = require('../controllers/authController');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

userRouter.delete('/deleteMe', authController.protect, deleteMe);

userRouter.patch('/updateMe', authController.protect, updateMe);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

module.exports = userRouter;
