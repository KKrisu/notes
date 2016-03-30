var passport = require('passport');
var path = require('path');

var model = require(appRoot + '/server/model');

var requireLogin = require(appRoot + '/server/middlewares').requireLogin;

module.exports = (function() {
    'use strict';
    var router = require('express').Router();

    // search
    router.get('/posts', requireLogin, function(req, res) {
        model.getPosts(req.query).then(function (result) {
            res.type('application/json');
            res.send(result);
        });
    });

    // fetching single post
    router.get('/posts/:id', requireLogin, function(req, res) {
        model.getSinglePost(req.params).then(function (result) {
            res.type('application/json');
            res.send(result);
        }, function (err) {
            if(err.message === 'no results') {
                res.send(404, 'There is no entry with specified value');
            } else {
                res.send(500);
            }
        });
    });

    // saving post
    router.post('/posts', requireLogin, function (req, res) {
        model.savePost(req.body).then(function (id) {
            res.send({id: id});
        }, function (err) {
            console.error('Saving post fail.');
            res.send(500, err.message);
        });
    });

    // updating post
    router.patch('/posts/:id', requireLogin, function (req, res) {
        model.patchPost(req.params.id, req.body).then(function () {
            res.send();
        }, function (err) {
            console.error('Pathing post fail.');
            res.send(500, err.message);
        });
    });

    router.get('/tags', requireLogin, function (req, res) {
        model.getTags().then(function (result) {
            res.type('application/json');
            res.send(result);
        }, function(err) {
            res.send(500);
        });
    });

    router.get('/tags/:id', requireLogin, function (req, res) {
        model.getSingleTag(req.params).then(function (result) {
            res.type('application/json');
            res.send(result);
        }, function (err) {
            if(err.message === 'no results') {
                res.send(404, 'There is no entry with specified value');
            } else {
                res.send(500);
            }
        });
    });

    router.post('/tags', requireLogin, function(req, res) {
        model.saveTag(req.body).then(function(id) {
            res.type('application/json');
            res.send({id: id});
        }, function (err) {
            console.error('Saving new tag fail.');
            res.send(500, err.message);
        });
    });

    router.post('/commands', requireLogin, function (req, res) {
        // if app fails for some reason it is possible to restart it through api
        if(req.body.command === 'reconnect_db') {
            model.reconnect();
        }
        res.send({result: true});
    });

    return router;
})();
