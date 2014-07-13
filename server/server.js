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

app.get('/api/v1/posts', function(req, res) {
    model.getPosts().then(function (result) {
        res.type('application/json');
        res.send(result);
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
