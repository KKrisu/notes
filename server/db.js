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

module.exports = {
    getPosts: function () {
        var defer = Q.defer();
        // TODO: search by tags
        // TODO: search by titles
        // TODO: search by body
        // TODO: concatenate and return
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

    getSinglePost: function (data) {
        var defer = Q.defer();
        dbConnection.query('SELECT * FROM posts WHERE id=' + data.id + ' LIMIT 1',
            function(err, rows) {
                if(err) {
                    console.error(err);
                    defer.reject(new Error(err));
                    return false;
                }
                if(!rows.length) {
                    defer.reject(new Error('no results'));
                    return false;
                }
                defer.resolve(rows[0]);
            }
        );
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
