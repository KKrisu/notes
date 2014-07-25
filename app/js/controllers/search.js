angular.module('notes')
.controller('search', function ($scope, api, $location) {
    'use strict';

    $scope.results = [];

    $scope.form = {};

    api.all('posts').getList($location.search()).then(function (data) {
        pr('success', data);
        $scope.results = data;
    }, function () {
        pr('fail', arguments);
    });

});
