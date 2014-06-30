'use strict';

global.pr = console.log.bind(console);
var express = require('express');
var app = express();
var model = require('./db');

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
