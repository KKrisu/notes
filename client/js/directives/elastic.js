// borrowed from http://stackoverflow.com/a/24090733/630409
//
// automatically updates textarea height
//
module.exports = function($timeout) {
    'use strict';

    return {

        restrict: 'A',

        link: function($scope, element) {
            // check do I need this
            $scope.initialHeight = $scope.initialHeight || element[0].style.height;

            var resize = function() {
                element[0].style.height = '' + element[0].scrollHeight + 'px';
            };

            element.on('input change', resize);

            $timeout(resize, 0);
        }
    };
};
