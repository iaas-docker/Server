var mongoose = require('mongoose');

var ipAddressSchema = new mongoose.Schema({
  ip: String,
  //Decimal
  mask: String,
  gateway: String,
  state: String
});

ipAddressSchema.index({ ip: 1, mask: 1, gateway: 1 }, { unique: true });
var IpAddress = mongoose.model('IpAddress', ipAddressSchema);

const STATES = Object.freeze({
  ASSIGNED:     "assigned",
  UN_ASSIGNED:  "unassigned",
});

module.exports = {
  IpAddress: IpAddress,
  IpStates: STATES
};