'use strict';
var LocalStrategy   = require('passport-local').Strategy;

module.exports = function(passport, model) {

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
