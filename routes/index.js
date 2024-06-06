const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Photo = require('../models/photo');
const User = require('../models/user');

// 파일 업로드 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
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
        user: req.session.user || { name: 'Guest', email: 'guest@example.com' }
    });
});

// 사진 업로드 라우트
router.post('/upload', upload.single('photo'), (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('You must be logged in to upload photos');
    }

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
    res.render('home', { title: 'Home', user: req.session.user || { name: 'Guest', email: 'guest@example.com' } });
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
        res.redirect('/');  // 로그인 화면으로 리디렉션
    });
});

/* DELETE photo */
router.post('/delete/:id', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) {
            return res.status(404).send('Photo not found');
        }

        if (!req.session.user || photo.uploadedBy.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('You do not have permission to delete this photo');
        }

        const filePath = path.join(__dirname, '../public/uploads', photo.filename);
        fs.unlink(filePath, async (err) => {
            if (err) {
                return res.status(500).send(err);
            }

            await Photo.findByIdAndDelete(req.params.id);
            res.redirect('/');
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
