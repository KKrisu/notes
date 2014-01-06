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
        saved: ['programming', 'js', 'stx', 'webgl', 'live', 'wife'],
        selectedTags: [],
        newTag: '',

        // TODO: decide: use this or no??
        similarityTags: [
            ['programming', 'development', 'code', 'coding']
        ]
    };

    $scope.typeaheadSelected = function () {

    };

});
