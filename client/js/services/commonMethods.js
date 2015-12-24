module.exports = function (api) {
    'use strict';

    this.updateImportance = function(id, importantValue) {
        return api.one('posts', id).patch({
            important: importantValue
        });
    };
};
