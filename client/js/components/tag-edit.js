module.exports = {

    templateUrl: '/partials/tagEdit.html',

    bindings: {
    },

    controller: function (
        $route, $location, api, growl
    ) {
        'use strict';

        var id = $route.current.params.id;

        if(id) {
            api.one('tags', id).get().then((data) => {
                this.tag = data;
            });
        } else {
            // new tag to save
            this.tag = {name: ''};
        }

        this.saveTag = function() {
            api.all('tags').post(this.tag).then((result) => {
                $location.path('/tags/' + result.id);
                growl.success('Tag saved successfully');
            });
        };
    },
};
