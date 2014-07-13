angular.module('notes')
.controller('search', function ($scope, api) {
    'use strict';

    $scope.results = [];

    $scope.form = {};

    api.all('posts').getList().then(function (data) {
        pr('success', data);
        $scope.results = data;
    }, function () {
        pr('fail', arguments);
    });

});
