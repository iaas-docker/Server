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
  state: String,
  stateMessage: String
});

var Instance = mongoose.model('Instance', instance);

const STATES = Object.freeze({
  CREATING:     "creating",
  RESOURCES_ASSIGNED:     "resources_assigned",
  RUNNING:  "running",
});


module.exports = {
  Instance: Instance,
  InstanceStates: STATES
};