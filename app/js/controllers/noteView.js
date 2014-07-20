angular.module('notes')
.controller('noteView', function ($scope, $route, api) {
    'use strict';

    pr($route.current.params.id);
    var id = $route.current.params.id;


    api.one('posts', id).get().then(function(data) {
        pr('success', data);
        $scope.note = data;
    }, function(data) {
        pr('failure', data);
    });

});
