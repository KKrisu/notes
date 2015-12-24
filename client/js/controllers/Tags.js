module.exports = function ($scope, $route, api) {
    'use strict';

    api.all('tags').getList().then(function(data) {
        pr('success', data);
        $scope.tags = data;
    }, function(data) {
        pr('failure', data);
    });

};
