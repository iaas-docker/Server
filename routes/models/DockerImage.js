const mongoose = require('mongoose');

var dockerImageSchema = new mongoose.Schema({
  name: String,
  operatingSystem: String,
  registryId: String
});

var DockerImage = mongoose.model('DockerImage', dockerImageSchema);

const TYPE = Object.freeze({
  DOCKER:     "docker",
  VM:         "vm",
});

module.exports = {
  DockerImage: DockerImage,
  TYPE: TYPE
};