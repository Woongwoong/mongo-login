const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  title: String
});

module.exports = mongoose.model('Image', imageSchema);
