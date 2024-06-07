const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();

require('./config/passport')(passport);

// MongoDB 연결 설정
mongoose.connect('mongodb://localhost/mongo-login', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter);

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

module.exports = app;