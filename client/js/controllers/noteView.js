angular.module('notes')
.controller('noteView', function ($scope, $route, api, constants) {
    'use strict';

    var id = $route.current.params.id;

    $scope.constants = constants;

    api.one('posts', id).get().then(function (data) {
        $scope.note = data;
    }, function (err) {
        console.error('fetching single post failure', err);
    });

});
