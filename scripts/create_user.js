'use strict';

var prompt = require('prompt');

var model = require('../server/model');
model.reconnect();

var schema = {
    properties: {
        email: {
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Name must be only letters, spaces, or dashes',
            required: true,
        },
        password: {
            hidden: true,
            message: 'Password is required',
            required: true,
        }
    }
};

prompt.start();

prompt.get(schema, function (err, input) {
    model.saveUser(input.email, input.password).then(function(result) {
        console.log('User', input.email, 'successfully created with ID', result.insertId);
        process.exit();
    }, function(err) {
        console.error('Error creating user', err);
        process.exit();
    });
});

