var markdownAstParser = require('../../node_modules/markdown-to-ast/lib/markdown/markdown-parser.js').parse;

module.exports = function ($scope, $location, post, savedTags, api) {
    'use strict';

    $scope.form = post || {};

    // Picks only useful part of ast items
    function formatAstChildren(children) {
        return children.map(function(item) {
            var formatted = {
                type: item.type,
                depth: item.depth,
                raw: item.raw,
            };

            if (item.children) {
                formatted.children = formatAstChildren(item.children);
            }

            return formatted;
        });
    }

    function organizeByHeaders(items) {
        var currentHeaderDepth = 0;
        var currentItem;
        var formatted = [];
        items.forEach(function(item) {

            // pushing directly items before first Header
            if (currentHeaderDepth === 0 && item.type !== 'Header' && !currentItem) {
                formatted.push(item);
                return;
            }

            if (item.type === 'Header' && (currentHeaderDepth === 0 || item.depth <= currentHeaderDepth)) {
                currentHeaderDepth = item.depth;
                formatted.push(item);
                currentItem = item;
            } else {
                if (!currentItem.subitems) {
                    currentItem.subitems = [];
                }
                currentItem.subitems.push(item);
            }
        });

        formatted.forEach(function(item) {
            if (item.subitems) {
                item.subitems = organizeByHeaders(item.subitems);
            }
        });

        return formatted;
    }

    $scope.$watch('form.body', function(newBody) {
        var ast = markdownAstParser(newBody);
        var formatted = formatAstChildren(ast.children);
        formatted = organizeByHeaders(formatted);

        $scope.formattedAst = JSON.stringify(formatted, null, 2);
    });

    $scope.contentUpdated = function () {
        // TODO: pre-save every minute or something
    };

    $scope.saveEntry = function () {

        // sending only list of tags ids to API
        if($scope.tags.selected.length) {
            $scope.form.tags = _.reduce($scope.tags.selected,
                function (result, tag) {
                    var foundTag = _.find(savedTags, function(_tag) {
                        return _tag.name === tag;
                    });
                    if(foundTag) {
                        result.push(foundTag.id);
                    }
                    return result;
                },
            []);
        }

        pr('to save:', $scope.form);

        api.all('posts').post($scope.form).then(function(result) {
            $location.path('/posts/' + result.id);
        }, function () {
            pr('saving error', arguments);
        });
    };

    $scope.statuses = [{
        id: 0,
        name: 'draft'
    }, {
        id: 1,
        name: 'public'
    }, {
        id: 8,
        name: 'deleted'
    }];

    // TODO: should be sorted by occurence
    $scope.tags = {
        saved: _.map(savedTags, 'name'),
        selected: []
    };
    if($scope.form.tags && $scope.form.tags.length) {
        // mapping existing tags to just array of names
        // only in case of editing existing note
        $scope.tags.selected = _.reduce($scope.form.tags,
            function (result, tag) {
                result.push(tag.name);
                return result;
            },
        []);
    }

    $scope.typeaheadSelected = function () {
        pr('typeaheadSelected');

        if($scope.tags.selected.indexOf($scope.tags.newTag) >= 0) {
            pr('tag already exists');
        } else {
            $scope.tags.selected.push($scope.tags.newTag);
        }

        $scope.tags.newTag = '';

    };

    $scope.cancelTag = function (tag) {
        if(!tag || $scope.tags.selected.indexOf(tag) < 0) {
            return false;
        }

        _.remove($scope.tags.selected, function (t) {
            return t === tag;
        });
    };
};
