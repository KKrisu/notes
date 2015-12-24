module.exports = function ($scope, $route, $location, api) {
    'use strict';

    var id = $route.current.params.id;

    if(id) {
        api.one('tags', id).get().then(function(data) {
            pr('success', data);
            $scope.tag = data;
        }, function(data) {
            pr('failure', data);
        });
    } else {
        // new tag to save
        $scope.tag = {name: ''};
    }

    $scope.saveTag = function() {
        api.all('tags').post($scope.tag).then(function(result) {
            $location.path('/tags/' + result.id);
        }, function () {
            pr('saving error', arguments);
        });
    };

};
