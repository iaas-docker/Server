var mongoose = require('mongoose');

var instance = new mongoose.Schema({
  cores: Number,
  ram: Number,
  memory: Number,
  name: String,
  userId: String,
  instanceGroupId: String,
  imageId: String,
  baseImageId: String,
  physicalMachineId: String,
  ipAddressId: String,
  status: String
});

var Instance = mongoose.model('Instance', instance);

const STATUS = Object.freeze({
  CREATING:     "creating",
  RUNNING:  "running",
});


module.exports = {
  Instance: Instance,
  InstanceStatus: STATUS
};