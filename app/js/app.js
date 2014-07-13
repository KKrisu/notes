window.pr = window.console.log.bind(window.console);
angular.module('notesFilters', []);
angular.module('notes', [
    'notesFilters', 'ui.bootstrap', 'restangular', 'ngRoute'
])

.config(function($routeProvider) {
    'use strict';

    $routeProvider.when('/search', {
        templateUrl: '/partials/search.html',
        controller: 'search'
    })
    .when('/posts/new', {
        templateUrl: '/partials/newNote.html',
        controller: 'newNote'
    })
    .when('/posts/:id', {
        templateUrl: '/partials/noteView.html',
        controller: 'noteView'
    })
    .otherwise({
        redirectTo: '/search'
    });
});
