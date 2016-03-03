'use strict';

global.pr = console.log.bind(console);
var path = require('path');
var fs = require('fs');
var configFile = 'app' +
    (process.env.NODE_ENV === 'production' ? '.prod' : '') + '.json';
var config = JSON.parse(fs.readFileSync('./config/' + configFile, 'utf8'));
global.config = config;

var express = require('express');
var session  = require('express-session');
var flash = require('connect-flash');
var app = express();
var model = require('./server/model');
model.reconnect();
var bodyParser = require('body-parser');
var passport = require('passport');
var ejs = require('ejs');
var ejsLocals = require('ejs-locals');

// pass passport and model for configuration
require('./config/passport')(passport, model);

app.set('view engine', 'ejs');
app.engine('ejs', ejsLocals);
app.use('/static', express.static('./client/app/static'));
app.use('/partials', express.static('./client/partials'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // it is overridden in session config in /login request
        maxAge: 1000 * 60 * 60 * 3, // 3h
    },
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function (req, res, next) {

    // adding logged in user data to session
    if (req.session.passport && req.session.passport.user) {
        res.locals.user = req.session.passport.user;
    }

    // flashes with redirecting handling
    if(req.session.flash && Object.keys(req.session.flash).length > -1) {
        res.locals.flashMessages = req.flash();
    } else {
        res.locals.flashMessages = null;
    }

    next();
});

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


// ### ROUTES ###

app.get('/login', function(req, res) {
    res.render(path.join(__dirname, './client/login.ejs'));
});

app.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

// process the login form
app.post('/login', passport.authenticate('password-login', {
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

app.get('/', function(req, res) {
    if(req.isAuthenticated()) {
        res.render(path.join(__dirname, './client/index.ejs'));
    } else {
        res.redirect('/login');
    }
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

app.patch('/api/v1/posts/:id', function (req, res) {
    model.patchPost(req.params.id, req.body).then(function () {
        res.send();
    }, function (err) {
        console.error('Pathing post fail.');
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
        model.reconnect();
    }
    res.send({result: true});
});

app.listen(config.port);
console.info('Server has started listening on port', config.port);
