angular.module('notes')
.controller('newNote', function ($scope, $location, savedTags, api) {
    'use strict';

    pr(savedTags);
    $scope.form = {};

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

    // TODO: should be sorted by occurence
    $scope.tags = {
        saved: _.map(savedTags, 'name'),
        selected: []
    };

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
});
