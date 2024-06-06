const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Image = require('../models/Image');

// 홈 라우트
router.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/gallery');
  } else {
    res.redirect('/login');
  }
});

// 로그인 라우트
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username, password }, (err, user) => {
    if (err || !user) {
      return res.redirect('/login');
    }
    req.session.loggedIn = true;
    req.session.username = username;
    res.redirect('/gallery');
  });
});

// 로그아웃 라우트
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// 회원가입 라우트
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  newUser.save(err => {
    if (err) {
      return res.redirect('/register');
    }
    res.redirect('/login');
  });
});

// 갤러리 라우트
router.get('/gallery', (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect('/login');
  }
  const page = parseInt(req.query.page) || 1;
  const perPage = 16;

  Image.find().skip((page - 1) * perPage).limit(perPage).exec((err, images) => {
    if (err) {
      return res.status(500).send('Error loading images');
    }
    Image.countDocuments().exec((err, count) => {
      if (err) {
        return res.status(500).send('Error counting images');
      }
      res.render('gallery', {
        images,
        page,
        totalPages: Math.ceil(count / perPage)
      });
    });
  });
});

// 이미지 삭제 라우트
router.get('/delete/:id', (req, res) => {
  Image.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      return res.status(500).send('Error deleting image');
    }
    res.redirect('/gallery');
  });
});

// 이미지 업로드 라우트 (이미지 모델 수정 필요)
router.post('/upload', (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect('/login');
  }
  const newImage = new Image({
    url: req.body.url,
    title: req.body.title,
    uploadedBy: req.session.username // 로그인한 사용자 이름 저장
  });
  newImage.save(err => {
    if (err) {
      return res.status(500).send('Error uploading image');
    }
    res.redirect('/gallery');
  });
});

module.exports = router;
