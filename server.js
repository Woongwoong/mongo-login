const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

mongoose.connect('mongodb://localhost:27017/mongo-login', { useNewUrlParser: true });

const User = require('./models/User');
const Gallery = require('./models/Gallery');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/gallery', require('./routes/gallery'));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/login', (req, res) => {
    // 로그인 처리 코드
    req.session.loggedin = true;
    req.session.username = req.body.username;
    res.redirect('/gallery');
});

app.post('/register', (req, res) => {
    // 회원가입 처리 코드
    res.redirect('/login');
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});