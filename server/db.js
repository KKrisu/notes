'use strict';

var mysql      = require('mysql');
var dbConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'notes_u',
    password : 'notes_p',
    database : 'notes_db_dev'
});
var Q = require('q');
var _ = require('lodash');

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
                    // resolving defer without tags
                    defer.resolve(result);
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

    savePost: function (data) {
        var _this = this;

        var query, preparedStatment;
        var defer = Q.defer();

        if(!data.id) {
            // creates new posts
            query = 'INSERT INTO posts ' +
                    '(title, body) VALUES (?, ?)';
            preparedStatment = [data.title, data.body];
        } else {
            // updates existing post
            query = 'UPDATE tags AS posts ' +
                    'SET tag.title = ?, ' +
                    'SET tag.body = ? ' +
                    'WHERE tag.id = ?';
            preparedStatment = [data.title, data.body, data.id];
        }

        dbConnection.query(query, preparedStatment, function(err, rows) {
            if(err) {
                console.error(err);
                defer.reject(new Error(err.message));
                return false;
            }

            var resolve = function () {
                // insertId available when INSERTING new entry
                // data.id when updating existing one
                defer.resolve(rows.insertId || data.id);
            };

            if(!data.tags || !data.tags.length) {
                resolve();
            }

            var updateTags = function (currentTags) {
                var tagsPromises = [];

                for(var i = 0; i < data.tags.length; i++) {
                    if(!currentTags) {
                        tagsPromises.push(_this.matchPostWithTag(
                            rows.insertId || data.id,
                            data.tags[i]
                        ));
                    }
                }

                Q.all(tagsPromises).then(function () {
                    resolve();
                }, function (err) {
                    defer.reject(new Error(err.message));
                });
            }

            if(!data.id) {
                // new entry
                updateTags();
            } else {
                // updating existing entry
                _this.getPostTags().then(function (currentTags) {
                    var tagsArr = _.reduce(currentTags, function (result, tag) {
                        return result.push(tag.id);
                    }, []);
                    updateTags(tagsArr);
                }, function (err) {
                    defer.reject(new Error(err.message));
                })
            }

        });

        return defer.promise;
    },

    matchPostWithTag: function (postId, tagId) {
        pr('matchPostWithTag', postId, tagId);
        var defer = Q.defer();
        var query = 'INSERT INTO posts_tags ' +
                '(post_id, tag_id) VALUES (?, ?)';
        var preparedStatment = [postId, tagId];

        dbConnection.query(query, preparedStatment, function(err, rows) {
            if(err) {
                console.error(err);
                defer.reject(new Error(err.message));
                return false;
            }

            defer.resolve(rows.insertId);
        });

        return defer.promise;
    },

    disconnectPostWithTag: function (postId, tagId) {
        var defer = Q.defer();
        var query = 'DELETE FROM posts_tags ' +
                'WHERE post_id = ? AND tag_id = ?';
        var preparedStatment = [postId, tagId];

        dbConnection.query(query, preparedStatment, function(err, rows) {
            if(err) {
                console.error(err);
                defer.reject(new Error(err.message));
                return false;
            }

            defer.resolve(rows.insertId);
        });

        return defer.promise;
    },

    getTags: function () {
        var defer = Q.defer();
        dbConnection.query('SELECT * FROM tags', function(err, rows) {
            if(err) {
                console.error(err);
                defer.reject(new Error(err));
                return false;
            }
            defer.resolve(rows);
        });
        return defer.promise;
    },

    getSingleTag: function(data) {

        var defer = Q.defer();
        var query = 'SELECT * FROM tags WHERE id = ? LIMIT 1';

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
                defer.resolve(result);
            }
        );
        return defer.promise;
    },

    saveTag: function(data) {

        var query, preparedStatment;
        var defer = Q.defer();

        if(!data.id) {
            // creates new tag
            // TODO: check duplicates
            query = 'INSERT INTO tags' +
                    '(name) VALUES (?)';
            preparedStatment = [data.name];
        } else {
            // updates existing tag
            query = 'UPDATE tags AS tag ' +
                    'SET tag.name = ? ' +
                    'WHERE tag.id = ?';
            preparedStatment = [data.name, data.id];
        }

        dbConnection.query(query, preparedStatment, function(err, rows) {
            if(err) {
                console.error(err);
                defer.reject(new Error(err));
                return false;
            }

            // insertId available when INSERTING new entry
            // data.id when updating existing one
            defer.resolve(rows.insertId || data.id);
        });

        return defer.promise;
    }
};
