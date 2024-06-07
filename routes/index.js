const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/gallery', isAuthenticated, (req, res) => {
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

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;