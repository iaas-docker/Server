const mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  type: String,
  backedById: String
});

var Image = mongoose.model('Image', imageSchema);

const TYPE = Object.freeze({
  DOCKER:     "docker",
  VM:         "vm",
});

module.exports = {
  Image: Image,
  TYPE: TYPE
};