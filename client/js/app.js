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
        template: '<note-edit note="$resolve.note", available-tags="$resolve.tags"></note-edit>',
        resolve: {
            note: function () {
                return {};
            },
            tags: function (api) {
                return api.all('tags').getList();
            }
        },
    })
    .when('/posts/:id', {
        template: '<note-view note="$resolve.note"></note-view>',
        resolve: {
            note: ($route, api) => api.one('posts', $route.current.params.id).get()
        },
    })
    .when('/posts/:id/edit', {
        template: '<note-edit note="$resolve.note" available-tags="$resolve.tags"></note-edit>',
        resolve: {
            note: function ($route, api) {
                return api.one('posts', $route.current.params.id).get();
            },
            tags: function (api) {
                return api.all('tags').getList();
            },
        },
    })
    .when('/tags', {
        template: '<tags tags="$resolve.tags"></tags>',
        resolve: {
            tags: function (api) {
                return api.all('tags').getList();
            },
        },
    })
    .when('/tags/new', {
        template: '<tag-edit></tag-edit>',
    })
    .when('/tags/:id', {
        template: '<tag-edit></tag-edit>',
    })
    .otherwise({
        redirectTo: '/search'
    });
})

.config(function(growlProvider) {
    'use strict';
    growlProvider.globalTimeToLive(3000);
})

.run(function($rootScope, USER) {
    $rootScope.loggedUser = USER;
})

.component('noteView', require('./components/note-view'))
.component('astTreePreview', require('./components/ast-tree-preview'))
.component('noteEdit', require('./components/note-edit'))
.component('tags', require('./components/tags'))
.component('tagEdit', require('./components/tag-edit'))

.controller('Nav', require('./controllers/Nav'))
.controller('Search', require('./controllers/Search'))

.directive('elastic', require('./directives/elastic'))
.directive('focusMe', require('./directives/focusMe'))

.filter('autolinker', require('./filters/autolinker'))
.filter('markdownToHtml', require('./filters/markdownToHtml'))

.service('api', require('./services/api'))
.service('ast', require('./services/ast'))
.service('beforeUnload', require('./services/beforeUnload'))
.service('commonMethods', require('./services/commonMethods'))
.service('constants', require('./services/constants'));
