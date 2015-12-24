// borrowed from http://stackoverflow.com/a/14837021/630409 with some modifications
//
// sets focus on element when focusMe attribute value changes to true
// also automatically sets focusMe attr to false when element is blured
//
module.exports = function($parse, $timeout) {
    'use strict';

    return {

        restrict: 'A',

        link: function(scope, element, attrs) {

            var model = $parse(attrs.focusMe);
            scope.$watch(model, function(value) {
                if(value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });

            // set attribute focusMe to 'false' on blur event
            element.bind('blur', function() {
                $timeout(function () {
                    model.assign(scope, false);
                });
            });
        }

    };
};
