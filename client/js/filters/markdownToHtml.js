module.exports = function ($sce) {
    'use strict';

    var markdown = window.markdown;

    return function (input) {

        if(!input) {
            return '';
        }

        var output = markdown.toHTML(input);

        return $sce.trustAsHtml(output);

    };
};
