var mongoose = require('mongoose');
const {body} = require('express-validator/check');

var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  portusId: Number,
  portusToken: String,
  firebaseId: String,
  admin: Boolean
});

userSchema.methods.getId = function () {
  return this['_id'];
};

var User = mongoose.model('User', userSchema);

module.exports = User;