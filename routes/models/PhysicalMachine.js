var mongoose = require('mongoose');

var physicalMachineSchema = new mongoose.Schema({
  name: String,
  mac: String,
  cores: Number,
  ram: Number,
  memory: Number,
  freeCores: Number,
  freeRam: Number,
  freeMemory: Number,
  assignedRanges: [Number],
  operatingSystem: String,
  ipAddressId: String,
  state: String
});

const STATES = Object.freeze({
  SHUT_DOWN:    "shut_down",
  RUNNING:      "running",
});

var PhysicalMachine = mongoose.model('PhysicalMachine', physicalMachineSchema);

module.exports = {
  PhysicalMachine: PhysicalMachine,
  MachineStates: STATES
};