var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  portusId: Number,
  portusToken: String
});

userSchema.methods.getId = function () {
  return this['_id'];
};

var User = mongoose.model('User', userSchema);

module.exports = User;