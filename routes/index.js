const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Photo = require('../models/photo');

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
    const photos = await Photo.find().sort({ uploadDate: -1 });
    res.render('home', { 
        title: 'Home',
        photos,
        name: req.user ? req.user.name : 'Guest',
        email: req.user ? req.user.email : 'guest@example.com'
    });
});

// 사진 업로드 라우트
router.post('/upload', upload.single('photo'), (req, res) => {
    const newPhoto = new Photo({
        filename: req.file.filename
    });
    newPhoto.save()
        .then(() => res.redirect('/'))
        .catch(err => res.status(500).send(err));
});

// 기존 코드들

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Home' });
});

/* GET profile page. */
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Profile', name: req.user.name, email: req.user.email });
});

module.exports = router;
