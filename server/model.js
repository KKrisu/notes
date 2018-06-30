'use strict';

var mysql = require('mysql');
var Q = require('q');
var _ = require('lodash');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var fs = require('fs');
var path = require('path');

var configFile = 'app' + (process.env.NODE_ENV === 'production' ? '.prod' : '') + '.json';
var dbConfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../config/' + configFile), 'utf8')
).db;

var model = module.exports = {
    connection: null,

    reconnect: function () {
        model.connection = mysql.createConnection(dbConfig);

        model.connection.connect(function (err) {
            if (err) {
                console.error('error connecting wity mysql: ' + err);
                setTimeout(model.reconnect, 2000);
                return;
            }

            console.log('connected with mysql as id ' + model.connection.threadId);
        });

        model.connection.on('error', function (err) {
            console.log('db connection error', err);
            if(err.code === 'PROTOCOL_CONNECTION_LOST') {
                model.reconnect();
            } else {
                throw err;
            }
        });
    },

    getPosts: function (params) {
        // pr(params);
        var _this = this;
        var defer = Q.defer();
        var query = 'SELECT DISTINCT post.* FROM posts AS post ';
        var preparedStatment = [];
        var conditions = {
            OR: [],
            AND: []
        };

        if(typeof params.status === 'undefined') {
            // be default displaying active
            params.status = 1;
        }

        var searchQuery = function () {
            conditions.AND.push('post.status = ?');
            preparedStatment.push(params.status);

            if(conditions.OR.length || conditions.AND.length) {
                query += ' WHERE ';
                if(conditions.OR.length) {
                    query += '(' + conditions.OR.join(' OR ') + ')';
                    if(conditions.AND.length) {
                        query += ' AND ';
                    }
                }
                if(conditions.AND.length) {
                    query += conditions.AND.join(' AND ');
                }
            }

            query += ' ORDER BY post.important DESC';

            var q = model.connection.query(query, preparedStatment, function(err, rows) {
                if(err) {
                    console.error(err);
                    defer.reject(new Error(err));
                    return false;
                }

                var tagsPromises = [];
                _.each(rows, function (row) {
                    var promise = _this.getPostTags({post_id: row.id}).then(function (tags) {
                        row.tags = tags;
                    });
                    tagsPromises.push(promise);
                });
                Q.all(tagsPromises).then(function () {
                    defer.resolve(rows);
                });
            });
        };

        var addSearchByTagToQuery = function (searchTagBy) {
            var tagDefer = Q.defer();

            _this.getTags(searchTagBy).then(function (tags) {

                if (!tags.length) {
                    tagDefer.resolve(tags);
                    return;
                }

                // could be done with map instead of reduce
                var tags_ids = _.reduce(tags, function (result, tag) {
                    result.push(tag.id);
                    return result;
                }, []);

                query += 'JOIN posts_tags AS p_t ON p_t.post_id = post.id ';

                conditions.OR.push('p_t.tag_id IN (' + tags_ids.join(',') + ')');

                tagDefer.resolve(tags);
            });

            return tagDefer.promise;
        };

        var addSearchByBodyAndTitle = function () {
            conditions.OR.push('post.body REGEXP ?');
            conditions.OR.push('post.title REGEXP ?');
            preparedStatment.push(params.any.replace(/[ ]+/g, '|'));
            preparedStatment.push(params.any.replace(/[ ]+/g, '|'));
        };

        if(params.any) {
            // search by anything
            addSearchByTagToQuery(params.any).then(function () {
                addSearchByBodyAndTitle();
                searchQuery();
            });

        } else if(params.tag) {
            // search by tag
            addSearchByTagToQuery(params.tag).then((tags) => {
                if (tags.length) {
                    searchQuery();
                } else {
                    defer.resolve([]);
                }
            });
        } else {
            // returns all posts
            searchQuery();
        }


        return defer.promise;
    },

    getSinglePost: function (data) {
        var _this = this;

        var defer = Q.defer();
        var query = 'SELECT * FROM posts WHERE id = ? LIMIT 1';

        model.connection.query(query, [data.id],
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

        model.connection.query(query, [data.post_id],
            function(err, rows) {
                if(err) {
                    console.error(err);
                    defer.reject(new Error(err));
                    return false;
                }
                defer.resolve(rows);
            }
        );
        return defer.promise;
    },

    patchPost: function(id, body) {

        var defer = Q.defer();

        var query = 'UPDATE posts AS post SET ';
        var queryUpdates = [];
        var preparedStatment = [];

        for(var i in body) {
            if (body.hasOwnProperty(i)) {
                queryUpdates.push('post.' + i + ' = ?');
                preparedStatment.push(body[i]);
            }
        }

        query += queryUpdates.join(' , ');
        query += ' WHERE post.id = ?';

        preparedStatment.push(id);

        model.connection.query(query, preparedStatment, function(err, rows) {
            if(err) {
                console.error(err);
                defer.reject(new Error(err.message));
                return false;
            }

            defer.resolve();
        });

        return defer.promise;
    },

    savePost: function (data) {
        var _this = this;

        var query, preparedStatment;
        var defer = Q.defer();

        if(!data.id) {
            // creates new post
            query = 'INSERT INTO posts ' +
                    '(title, body) VALUES (?, ?)';
            preparedStatment = [data.title, data.body];
        } else {
            // updates existing post
            query = 'UPDATE posts AS post SET ' +
                    'post.title = ?, ' +
                    'post.body = ?, ' +
                    'post.status = ? ' +
                    'WHERE post.id = ?';
            preparedStatment = [data.title, data.body, data.status, data.id];
        }

        model.connection.query(query, preparedStatment, function(err, rows) {
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

                _.each(data.tags, function (tag) {
                    if(!currentTags || currentTags.indexOf(tag) < 0) {
                        tagsPromises.push(_this.matchPostWithTag(
                            rows.insertId || data.id,
                            tag
                        ));
                    }
                });

                var toRemove = _.difference(currentTags, data.tags);
                _.each(toRemove, function (tag) {
                    tagsPromises.push(_this.disconnectPostWithTag(
                        data.id, tag
                    ));
                });

                Q.all(tagsPromises).then(function () {
                    resolve();
                }, function (err) {
                    defer.reject(new Error(err.message));
                });
            };

            if(!data.id) {
                // new entry
                updateTags();
            } else {
                // updating existing entry
                _this.getPostTags({post_id: data.id}).then(
                    function (currentTags) {
                        var tagsArr = _.reduce(currentTags, function (result, tag) {
                            result.push(tag.tag_id);
                            return result;
                        }, []);
                        updateTags(tagsArr);
                    }, function (err) {
                        defer.reject(new Error(err.message));
                    });
            }

        });

        return defer.promise;
    },

    matchPostWithTag: function (postId, tagId) {
        var defer = Q.defer();
        var query = 'INSERT INTO posts_tags ' +
                '(post_id, tag_id) VALUES (?, ?)';
        var preparedStatment = [postId, tagId];

        model.connection.query(query, preparedStatment, function(err, rows) {
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

        model.connection.query(query, preparedStatment, function(err, rows) {
            if(err) {
                console.error(err);
                defer.reject(new Error(err.message));
                return false;
            }

            defer.resolve(rows.insertId);
        });

        return defer.promise;
    },

    getTags: function (filter) {
        var defer = Q.defer();
        var query = 'SELECT * FROM tags';
        var preparedStatment = [];

        if(filter) {
            query += ' WHERE name REGEXP ?';
            preparedStatment.push(filter.replace(/[ ]+/g, '|'));
        }

        model.connection.query(query, preparedStatment, function(err, rows) {
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

        model.connection.query(query, [data.id],
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

        model.connection.query(query, preparedStatment, function(err, rows) {
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
    },

    checkUserCredentials: function(email, password) {
        var defer = Q.defer();

        model.connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, rows) {
            if (err) {
                defer.reject(new Error(err));
                return;
            }
            if (!rows.length) {
                defer.reject('No user found for defined email.');
                return;
            }

            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, rows[0].password)) {
                defer.reject('Oops! Wrong password.');
                return;
            }

            // all is well, return successful user
            defer.resolve(rows[0]);
        });

        return defer.promise;
    },

    saveUser: function(email, password) {
        var defer = Q.defer();
        var query = 'INSERT INTO users ' +
                    '(email, password) VALUES (?, ?)';

        model.connection.query(query, [email, bcrypt.hashSync(password, salt)], function(err, result) {
            if (err) {
                defer.reject(new Error(err));
            } else {
                defer.resolve(result);
            }
        });

        return defer.promise;
    },

    getUserById: function(userId) {
        var defer = Q.defer();

        model.connection.query('SELECT * FROM users WHERE id = ?', [userId], function(err, rows) {
            if (err) {
                defer.reject(new Error(err));
                return;
            }
            if (!rows.length) {
                defer.reject('No user found.');
                return;
            }
            defer.resolve(rows[0]);
        });

        return defer.promise;
    },
};
