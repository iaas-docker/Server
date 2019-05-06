const mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  type: String,
  backedById: String
});

var Image = mongoose.model('Image', imageSchema);

module.exports = {
  Image: Image
};