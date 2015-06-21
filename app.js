'use strict';

global.pr = console.log.bind(console);
var path = require('path');
var fs = require('fs');
var configFile = 'app' +
    (process.env.NODE_ENV === 'production' ? '.prod' : '') + '.json';
var config = JSON.parse(fs.readFileSync('./config/' + configFile, 'utf8'));
global.config = config;

var express = require('express');
var basicAuth = require('basic-auth-connect');
var app = express();
var model = require('./server/db');
var bodyParser = require('body-parser');

app.use('/static', express.static('./client/app/static'));
app.use('/partials', express.static('./client/partials'));
app.use(basicAuth(config.basicAuth.user, config.basicAuth.password));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, './client/index.html'));
});

// search
app.get('/api/v1/posts', function(req, res) {
    model.getPosts(req.query).then(function (result) {
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
        console.error('Saving post fail.');
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

app.post('/api/v1/commands', function (req, res) {
    if(req.body.command === 'reconnect_db') {
        model.reconnectDb();
    }
    res.send({result: true});
});

app.listen(config.port);
console.info('Server has started listening on port', config.port);