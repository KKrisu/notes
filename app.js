'use strict';

var path = require('path');
var fs = require('fs');

var express = require('express');
var session  = require('express-session');
var flash = require('connect-flash');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var ejs = require('ejs');
var ejsLocals = require('ejs-locals');

var model = require('./server/model');
var configFile = 'app' +
    (process.env.NODE_ENV === 'production' ? '.prod' : '') + '.json';
var config = JSON.parse(fs.readFileSync('./config/' + configFile, 'utf8'));

// for fast debugging
global.pr = console.log.bind(console);
// config available globally
global.config = config;
// for constructing paths depended on project root
global.appRoot = path.resolve(__dirname);

model.reconnect();

// pass passport and model for passport strategy configuration
require('./config/passport')(passport, model);
app.set('view engine', 'ejs');
app.engine('ejs', ejsLocals);
app.engine('html', ejs.renderFile);
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
app.use(passport.session());
app.use(flash());

app.use(require('./server/middlewares').handleUserSession);
app.use(require('./server/middlewares').handleFlashes);

// # ROUTES #
app.use('/api/v1/', require('./server/routes/api'));
app.use('/', require('./server/routes/routes'));

// # Statics #
app.use(express.static('./client/dist'));

app.listen(config.port);
console.info('Server has started listening on port', config.port);
