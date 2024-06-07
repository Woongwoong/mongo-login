const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // 사용자 모델

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        User.findOne({ email: email }, (err, user) => {
            if (err) return done(err);
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }));
};