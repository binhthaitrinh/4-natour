const express = require('express');
const {
  getAllUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser
} = require('../controllers/userController');

const userRouter = express.Router();

userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

userRouter
  .route('/:id')
  .get(getUser)
  .delete(deleteUser)
  .patch(updateUser);

module.exports = userRouter;
