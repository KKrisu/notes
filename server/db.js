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
        var _this = this;

        var defer = Q.defer();
        var query = 'SELECT * FROM posts WHERE id = ? LIMIT 1';

        dbConnection.query(query, [data.id],
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

                var result = rows[0];
                _this.getPostTags({post_id: data.id}).then(function (tags) {
                    result.tags = tags;
                    defer.resolve(result);
                }, function (err) {
                    defer.reject(err);
                });
            }
        );
        return defer.promise;
    },

    /**
     * Returns tags of single post.
     *
     * @param {Object} data Config data.
     */
    getPostTags: function (data) {

        var defer = Q.defer();
        var query = 'SELECT * FROM tags as tag ' +
                    'JOIN posts_tags AS p_t ON tag.id = p_t.tag_id ' +
                    'WHERE p_t.post_id = ?';

        dbConnection.query(query, [data.post_id],
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
                defer.resolve(rows);
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
