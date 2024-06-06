const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');  // multer 추가

const app = express();

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/mongo-login', { useNewUrlParser: true, useUnifiedTopology: true });

// 세션 설정
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// 라우트 설정
const indexRouter = require('./routes/index')(upload);  // upload 미들웨어를 라우트에 전달
app.use('/', indexRouter);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
