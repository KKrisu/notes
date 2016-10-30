module.exports = {

    templateUrl: '/partials/astPreview.html',

    bindings: {
        data: '<'
    },

    controller: function(
        ast
    ) {
        'use strict';

        this.$onChanges = function(changesObj) {
            const data = changesObj.data;
            if (data && data.currentValue !== data.previousValue) {
                if (this.data) {
                    this.formattedAst = JSON.stringify(
                        ast.getAst(this.data), null, 2
                    );
                }
            }
        };
    },
};
