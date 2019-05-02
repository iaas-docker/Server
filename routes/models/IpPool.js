const mongoose = require('mongoose');
const {body} = require('express-validator/check');

var ipPoolSchema = new mongoose.Schema({
  name: String,
  gateway: String,
  mask: String
});

var IpPool = mongoose.model('IpPool', ipPoolSchema);

module.exports = {
  IpPool: IpPool
};