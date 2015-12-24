module.exports = function ($sce) {
    'use strict';

    var autolinker = new window.Autolinker();

    return function (input) {

        if(!input) {
            return '';
        }

        var output = autolinker.link(input.toString());

        return $sce.trustAsHtml(output);

    };
};
