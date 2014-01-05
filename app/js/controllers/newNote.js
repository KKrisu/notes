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

});
