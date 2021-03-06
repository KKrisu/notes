var passport = require('passport');
var path = require('path');

module.exports = (function() {
    'use strict';
    var router = require('express').Router();


    router.get('/login', function(req, res) {
        res.render(path.join(appRoot, './client/dist/assets/login.ejs'));
    });

    // process the login form
    router.post('/login', passport.authenticate('password-login', {
            failureRedirect : '/login',
            failureFlash : true
        }),
        function(req, res) {
            if (req.body.remember) {
                req.session.cookie.expires = false;
            } else {
                req.session.cookie.maxAge = 1000 * 60 * 60 * 3; // 3h
            }
        res.redirect('/');
    });

    router.get('/logout', function (req, res) {
        req.logout();
        req.session.destroy(function (err) {
            res.redirect('/');
        });
    });

    router.get(/^[^.]+$/, function(req, res) {
        if(req.isAuthenticated() || !config.session.loginRequired) {
            res.render(path.join(appRoot, './client/dist/index.html'));
        } else {
            res.redirect('/login');
        }
    });

    return router;
})();
