var mongoose = require('mongoose');
const {body} = require('express-validator/check');

var ipAddressSchema = new mongoose.Schema({
  ip: String,
  //Decimal
  mask: String,
  gateway: String,
  status: String
});

ipAddressSchema.index({ ip: 1, mask: 1, gateway: 1 }, { unique: true });
var IpAddress = mongoose.model('IpAddress', ipAddressSchema);

const STATUS = Object.freeze({
  ASSIGNED:     "assigned",
  UN_ASSIGNED:  "unassigned",
});

module.exports = {
  IpAddress: IpAddress,
  IpStatus: STATUS
};