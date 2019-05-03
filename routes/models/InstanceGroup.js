var mongoose = require('mongoose');

var instanceGroup = new mongoose.Schema({
  name: String,
  userId: String
});

var InstanceGroup = mongoose.model('InstanceGroup', instanceGroup);

module.exports = {
  InstanceGroup: InstanceGroup,
};