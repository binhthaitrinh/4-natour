const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
  },
  email: {
    type: String,
    require: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  photo: String,
  password: {
    type: String,
    require: [true, 'Please provide your password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Please provide your confirm password'],
    minlength: 8,
    validate: {
      // validate same passsword
      // only work on SAVE and CREATE, not UPDATE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
});

userSchema.pre('save', async function (next) {
  // to check if password is modified
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  // We donot need to store password confirm into database
  // it is only used to verify password
  this.passwordConfirm = undefined;
  next();
});

// FAT MODEL THIN CONTROLLER PHILOSOPHY

const User = mongoose.model('User', userSchema);

module.exports = User;