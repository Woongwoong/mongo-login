const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer'); // 파일 업로드용

const upload = multer({ dest: 'uploads/' }); // 업로드 디렉토리 설정

// 로그인 페이지 라우트
router.get('/login', (req, res) => {
    res.render('login');
});

// 로그인 처리 라우트
router.post('/login', passport.authenticate('local', {
    successRedirect: '/gallery',
    failureRedirect: '/login',
    failureFlash: true
}));

// 갤러리 페이지 라우트
router.get('/gallery', isAuthenticated, (req, res) => {
    // 업로드된 이미지 리스트를 불러와서 렌더링
    const images = [
        { url: '/uploads/photo1.jpg', title: 'Photo 1' },
        { url: '/uploads/photo2.jpg', title: 'Photo 2' },
        { url: '/uploads/photo3.jpg', title: 'Photo 3' },
        { url: '/uploads/photo4.jpg', title: 'Photo 4' },
        { url: '/uploads/photo5.jpg', title: 'Photo 5' },
        { url: '/uploads/photo6.jpg', title: 'Photo 6' },
        { url: '/uploads/photo7.jpg', title: 'Photo 7' },
        { url: '/uploads/photo8.jpg', title: 'Photo 8' }
    ];
    res.render('gallery', { images: images });
});

// 이미지 업로드 라우트 (로그인한 사용자만 가능)
router.post('/upload', isAuthenticated, upload.single('image'), (req, res) => {
    // 파일 업로드 처리 후 갤러리 페이지로 리디렉션
    res.redirect('/gallery');
});

// 이미지 삭제 라우트 (모든 사용자 가능)
router.post('/delete', (req, res) => {
    // 파일 삭제 처리
    res.redirect('/gallery');
});

module.exports = router;

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}