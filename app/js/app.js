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
        templateUrl: '/partials/editNote.html',
        controller: 'editNote',
        resolve: {
            savedTags: function (api) {
                return api.all('tags').getList();
            }
        }
    })
    .when('/posts/:id', {
        templateUrl: '/partials/noteView.html',
        controller: 'noteView'
    })
    .when('/posts/:id/edit', {
        templateUrl: '/partials/editNote.html',
        controller: 'editNote',
        resolve: {
            post: function ($route, api) {
                return api.one('posts', $route.current.params.id).get();
            },
            savedTags: function (api) {
                return api.all('tags').getList();
            }
        }
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
