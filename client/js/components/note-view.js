module.exports = {

    templateUrl: '/partials/noteView.html',

    bindings: {
        note: '<'
    },

    controller: function(
        $route, constants, commonMethods
    ) {
        'use strict';

        var id = $route.current.params.id;

        this.constants = constants;

        // updates important field of note
        this.updateImportance = function (importantValue) {
            commonMethods.updateImportance(id, importantValue).then(function () {
                this.note.important = importantValue;
            }, function (err) {
                console.error('updating important field failure', err);
            });
        };
    },
};
