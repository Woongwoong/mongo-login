const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Gallery = require('../models/Gallery');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    if (req.session.loggedin) {
        Gallery.find({}, (err, images) => {
            if (err) throw err;
            res.render('gallery', { images: images });
        });
    } else {
        res.redirect('/login');
    }
});

router.post('/upload', upload.single('image'), (req, res) => {
    const newImage = new Gallery({
        name: req.file.filename,
        path: req.file.path
    });
    newImage.save(err => {
        if (err) throw err;
        res.redirect('/gallery');
    });
});

router.post('/delete/:id', (req, res) => {
    Gallery.findByIdAndDelete(req.params.id, err => {
        if (err) throw err;
        res.redirect('/gallery');
    });
});

module.exports = router;