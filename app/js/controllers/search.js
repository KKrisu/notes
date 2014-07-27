angular.module('notes')
.controller('search', function ($scope, api, $location) {
    'use strict';

    $scope.results = [];

    $scope.form = {
        searchBy: 'any',
        input: '',
        search: function () {
            $location.search('');
            $location.search($scope.form.searchBy, $scope.form.input);
        }
    };

    $scope.searchByOptions = ['any', 'tag'];

    $scope.currentSearchBy = 'any';

    var updateSearchResults = function () {
        api.all('posts').getList($location.search()).then(function (data) {
            pr('success', data);
            $scope.results = data;
        }, function () {
            pr('fail', arguments);
        });
    };

    $scope.$watch(function () { return $location.search(); }, function () {
        var currentSearch = $location.search();
        var searchKey = Object.keys(currentSearch)[0];

        if( searchKey !== $scope.currentSearchBy ||
            currentSearch[searchKey] !== $scope.form.input
        ) {
            $scope.form.searchBy = searchKey;
            $scope.form.input = currentSearch[searchKey];
        }

        updateSearchResults();
    }, true);

});
