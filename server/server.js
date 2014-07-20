'use strict';

global.pr = console.log.bind(console);
var path = require('path');
var express = require('express');
var app = express();
var model = require('./db');

app.use('/static', express.static('../app/static'));
app.use('/partials', express.static('../app/partials'));

app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, '../app/index.html'));
});

// search
app.get('/api/v1/posts', function(req, res) {
    model.getPosts().then(function (result) {
        res.type('application/json');
        res.send(result);
    });
});

// fetching single post
app.get('/api/v1/posts/:id', function(req, res) {
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

app.post('/api/v1/posts', function (req, res) {
    model.savePost().then(function () {

    });
});

app.get('/api/v1/tags', function (req, res) {
    model.getTags().then(function (result) {
        res.type('application/json');
        res.send(result);
    });
});

app.post('/api/v1/tags', function (req, res) {
    model.saveTag().then(function (result) {
    });
});

app.listen(9000);
