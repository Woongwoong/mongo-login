// models/photo.js
const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  filename: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
