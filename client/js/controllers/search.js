angular.module('notes')
.controller('search', function ($scope, api, $location) {
    'use strict';

    $scope.results = [];

    $scope.form = {
        searchBy: 'any',
        input: '',
        inputFocused: true,
        search: function () {
            $location.search('');
            $location.search($scope.form.searchBy, $scope.form.input);
        }
    };

    $scope.searchByOptions = ['any', 'tag', 'status'];

    var updateSearchResults = function () {
        api.all('posts').getList($location.search()).then(function (data) {
            $scope.results = data;
        }, function (err) {
            console.error('fetching posts error', err);
        });
    };

    $scope.$watch(function () { return $location.search(); }, function () {
        var currentSearch = $location.search();
        var searchKey = Object.keys(currentSearch)[0];

        if(_.isEmpty(currentSearch)) {
            // search by any by default
            $location.search('any', '');
            return;
        }

        if( searchKey !== $scope.form.searchBy ||
            currentSearch[searchKey] !== $scope.form.input
        ) {
            $scope.form.searchBy = searchKey;
            $scope.form.input = currentSearch[searchKey];
        }

        updateSearchResults();
    }, true);

});
