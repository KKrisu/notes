module.exports = function ($rootScope) {
    'use strict';

    var activated = false;
    var msg = 'Note is not fully saved, are you sure you want to leave?';

    $rootScope.$on('$locationChangeStart', function(event) {
        if (!activated) {
            return;
        }

        var answer = confirm(msg);

        if (!answer) {
            event.preventDefault();
        }
    });

    window.onbeforeunload = function(e) {
        if (activated) {
            return msg;
        }
    };

    this.activate = function() {
        activated = true;
    };

    this.deactivate = function() {
        activated = false;
    };
};
