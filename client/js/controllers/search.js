angular.module('notes')
.controller('search', function (
    $scope, $timeout, api, $location, ngProgress, commonMethods
) {
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

    var searchDebounceTimer;
    $scope.$watch('form.input', function(newVal, oldVal) {
        if (newVal === oldVal) {
            return;
        }
        if (newVal === $location.search()[$scope.form.searchBy]) {
            return;
        }
        $timeout.cancel(searchDebounceTimer);
        searchDebounceTimer = $timeout(function() {
            $scope.form.search();
        }, 500);
    });

    $scope.$on('$destroy', function() {
        $timeout.cancel(searchDebounceTimer);
    });

    var updateSearchResults = function () {
        ngProgress.start();
        api.all('posts').getList($location.search()).then(function (data) {
            $scope.results = data;
            ngProgress.complete();
        }, function (err) {
            console.error('fetching posts error', err);
            ngProgress.reset();
        });
    };

    // updates important field of note
    $scope.updateImportance = function (noteId, importantValue) {
        commonMethods.updateImportance(noteId, importantValue).then(function () {
            _.find($scope.results, function(item) {
                return item.id === noteId;
            }).important = importantValue;
            updateSearchResults();
        }, function (err) {
            console.error('updating important field failure', err);
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
