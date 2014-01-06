window.pr = window.console.log.bind(window.console);
angular.module('notesFilters', []);
angular.module('notes', ['notesFilters', 'ui.bootstrap']);

angular.module('notes')
.controller('newNote', function ($scope) {
    'use strict';

    $scope.form = {};


    $scope.contentUpdated = function () {
        // TODO: presave every minute or something
    };

    $scope.saveEntry = function () {
        pr('to save:', $scope.form);
    };

    // TODO: should be sorted by occurence
    $scope.tags = {
        saved: ['programming', 'js', 'stx', 'webgl', 'live', 'wife'],
        selectedTags: [],
        newTag: '',

        // TODO: decide: use this or no??
        similarityTags: [
            ['programming', 'development', 'code', 'coding']
        ]
    };

    $scope.typeaheadSelected = function () {

    };

});

angular.module('notesFilters')
.filter('markdownToHtml', function ($sce) {
    'use strict';

    var markdown = window.markdown;

    return function (input) {

        if(!input) {
            return '';
        }

        var output = markdown.toHTML(input);

        return $sce.trustAsHtml(output);

    };
});

angular.module('notes').service('api', function () {
    
});
