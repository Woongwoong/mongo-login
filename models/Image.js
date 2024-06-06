const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  title: String,
  uploadedBy: String // 업로드한 사용자 이름 저장
});

module.exports = mongoose.model('Image', imageSchema);
