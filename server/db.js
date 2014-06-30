'use strict';

var mysql      = require('mysql');
var dbConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'notes_u',
    password : 'notes_p',
    database : 'notes_db'
});
var Q = require('q');

dbConnection.connect();

dbConnection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    if (err) throw err;
    console.log('The solution is: ', rows[0].solution);
});

module.exports = {
    getPosts: function () {
        var defer = Q.defer();
        dbConnection.query('SELECT * FROM posts', function(err, rows, fields) {
            if(err) {
                console.error(err);
                defer.reject(new Error(err));
                return false;
            }
            defer.resolve(rows);
        });
        return defer.promise;
    },

    savePost: function () {
        // TODO:
    },

    getTags: function () {
        var defer = Q.defer();
        dbConnection.query('SELECT * FROM tags', function(err, rows, fields) {
            if(err) {
                console.error(err);
                defer.reject(new Error(err));
                return false;
            }
            defer.resolve(rows);
        });
        return defer.promise;
    },

    saveTag: function () {
        // TODO:
    }
};
