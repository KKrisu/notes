window.pr = window.console.log.bind(window.console);
angular.module('notesFilters', []);
angular.module('notes', [
    'ui.bootstrap', 'restangular', 'ngRoute', 'ngProgress',
    'angular-growl'
])

.config(function($routeProvider) {
    'use strict';

    $routeProvider.when('/search', {
        templateUrl: '/partials/search.html',
        controller: 'Search'
    })
    .when('/posts/new', {
        templateUrl: '/partials/editNote.html',
        controller: 'EditNote',
        resolve: {
            savedTags: function (api) {
                return api.all('tags').getList();
            },
            post: function () {
                return {};
            }
        }
    })
    .when('/posts/:id', {
        templateUrl: '/partials/noteView.html',
        controller: 'NoteView'
    })
    .when('/posts/:id/edit', {
        templateUrl: '/partials/editNote.html',
        controller: 'EditNote',
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
        controller: 'Tags'
    })
    .when('/tags/new', {
        templateUrl: '/partials/editTag.html',
        controller: 'Tag'
    })
    .when('/tags/:id', {
        templateUrl: '/partials/editTag.html',
        controller: 'Tag'
    })
    .otherwise({
        redirectTo: '/search'
    });
})

.config(function(growlProvider) {
    'use strict';
    growlProvider.globalTimeToLive(3000);
})

.controller('EditNote', require('./controllers/EditNote'))
.controller('Nav', require('./controllers/Nav'))
.controller('NoteView', require('./controllers/NoteView'))
.controller('Search', require('./controllers/Search'))
.controller('Tag', require('./controllers/Tag'))
.controller('Tags', require('./controllers/Tags'))

.directive('elastic', require('./directives/elastic'))
.directive('focusMe', require('./directives/focusMe'))

.filter('autolinker', require('./filters/autolinker'))
.filter('markdownToHtml', require('./filters/markdownToHtml'))

.service('api', require('./services/api'))
.service('ast', require('./services/ast'))
.service('commonMethods', require('./services/commonMethods'))
.service('constants', require('./services/constants'));
