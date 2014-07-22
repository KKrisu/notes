'use strict';

global.pr = console.log.bind(console);
var path = require('path');
var express = require('express');
var app = express();
var model = require('./db');
var bodyParser = require('body-parser');

app.use('/static', express.static('../app/static'));
app.use('/partials', express.static('../app/partials'));
app.use(bodyParser.json());

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
    model.savePost(req.body).then(function (id) {
        res.send({id: id});
    }, function (err) {
        console.error('Saving new post fail.');
        res.send(500, err.message);
    });
});

app.get('/api/v1/tags', function (req, res) {
    model.getTags().then(function (result) {
        res.type('application/json');
        res.send(result);
    }, function(err) {
        res.send(500);
    });
});

app.get('/api/v1/tags/:id', function (req, res) {
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

app.post('/api/v1/tags', function(req, res) {
    model.saveTag(req.body).then(function(id) {
        res.type('application/json');
        res.send({id: id});
    }, function (err) {
        console.error('Saving new tag fail.');
        res.send(500, err.message);
    });
});

app.listen(9000);
