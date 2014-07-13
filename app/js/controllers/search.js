angular.module('notes')
.controller('search', function ($scope, api) {
    'use strict';

    $scope.form = {};

    api.all('posts').getList().then(function (data) {
        pr('success', data);
    }, function () {
        pr('fail', arguments);
    });

});
