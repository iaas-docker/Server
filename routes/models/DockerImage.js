const mongoose = require('mongoose');

var dockerImageSchema = new mongoose.Schema({
  name: String,
  operatingSystem: String,
  tag: String,
  dockerImageId: String
});

var DockerImage = mongoose.model('DockerImage', dockerImageSchema);

module.exports = {
  DockerImage: DockerImage
};