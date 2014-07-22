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
        controller: 'newNote',
        resolve: {
            savedTags: function (api) {
                return api.all('tags').getList().then(null, function() {
                    // TODO: handle global error somehow
                });
            }
        }
    })
    .when('/posts/:id', {
        templateUrl: '/partials/noteView.html',
        controller: 'noteView'
    })
    .when('/tags', {
        templateUrl: '/partials/tags.html',
        controller: 'tags'
    })
    .when('/tags/new', {
        templateUrl: '/partials/editTag.html',
        controller: 'tag'
    })
    .when('/tags/:id', {
        templateUrl: '/partials/editTag.html',
        controller: 'tag'
    })
    .otherwise({
        redirectTo: '/search'
    });
});
