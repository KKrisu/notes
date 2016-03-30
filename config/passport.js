'use strict';
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport, model) {

    passport.serializeUser(function(user, cb) {
        cb(null, {id: user.id, email: user.email});
    });

    passport.deserializeUser(function(user, cb) {
        model.getUserById(user.id).then(function (user) {
            cb(null, user);
        }, function(err) {
            return cb(err);
        });
    });

    passport.use(
        'password-login',
        new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            // allows us to pass back the entire request to the callback
            passReqToCallback : true,
        },
        function(req, email, password, done) {
            model.checkUserCredentials(email, password).then(function(user) {
                done(null, user);
            }, function(err) {
                done(null, false, {message: err});
            });
        })
    );
};
