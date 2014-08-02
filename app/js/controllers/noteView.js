angular.module('notes')
.controller('noteView', function ($scope, $route, api) {
    'use strict';

    var id = $route.current.params.id;

    api.one('posts', id).get().then(function (data) {
        $scope.note = data;
    }, function (err) {
        console.error('fetching single post failure', err);
    });

});
