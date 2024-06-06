const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Photo = require('../models/photo');
const User = require('../models/user');

// 파일 업로드 설정
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 홈 라우트
router.get('/', async (req, res) => {
    const photos = await Photo.find().populate('uploadedBy').sort({ uploadDate: -1 });
    res.render('home', { 
        title: 'Home',
        photos,
        name: req.session.user ? req.session.user.name : 'Guest',
        email: req.session.user ? req.session.user.email : 'guest@example.com'
    });
});

// 사진 업로드 라우트
router.post('/upload', upload.single('photo'), (req, res) => {
    const newPhoto = new Photo({
        filename: req.file.filename,
        uploadedBy: req.session.user._id
    });
    newPhoto.save()
        .then(() => res.redirect('/'))
        .catch(err => res.status(500).send(err));
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Home' });
});

/* GET profile page. */
router.get('/profile', function(req, res, next) {
  if (req.session.user) {
    res.render('profile', { title: 'Profile', name: req.session.user.name, email: req.session.user.email });
  } else {
    res.redirect('/');
  }
});

/* GET logout. */
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
