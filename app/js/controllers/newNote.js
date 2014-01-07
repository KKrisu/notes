angular.module('notes')
.controller('newNote', function ($scope) {
    'use strict';

    $scope.form = {};


    $scope.contentUpdated = function () {
        // TODO: presave every minute or something
    };

    $scope.saveEntry = function () {
        pr('to save:', $scope.form);
    };

    // TODO: should be sorted by occurence
    $scope.tags = {
        saved: ['programming', 'js', 'stx', 'webgl', 'live', 'wife', 'php', 'html'],
        selected: ['js', 'programming'],
        newTag: '',

        // TODO: decide: use this or no??
        similarityTags: [
            ['programming', 'development', 'code', 'coding']
        ]
    };

    $scope.typeaheadSelected = function () {

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

    $scope.tagFilter = function () {
        pr('tagFilter', arguments);
        return true;
    };

});
