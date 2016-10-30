module.exports = {

    templateUrl: '/partials/noteEdit.html',

    bindings: {
        note: '<',
        availableTags: '<',
    },

    controller: function (
        $location, api, beforeUnload
    ) {
        'use strict';

        this.form = this.note || {};

        this.contentUpdated = function () {
            beforeUnload.activate();
        };

        this.saveEntry = function () {

            // sending only list of tags ids to API
            if (this.tags.selected.length) {
                this.form.tags = _.reduce(this.tags.selected,
                    (result, tag) => {
                        var foundTag = _.find(this.availableTags, (_tag) => {
                            return _tag.name === tag;
                        });
                        if(foundTag) {
                            result.push(foundTag.id);
                        }
                        return result;
                    },
                []);
            }

            pr('to save:', this.form);

            api.all('posts').post(this.form).then(function(result) {
                beforeUnload.deactivate();
                $location.path('/posts/' + result.id);
            }, function () {
                pr('saving error', arguments);
            });
        };

        this.statuses = [{
            id: 0,
            name: 'draft'
        }, {
            id: 1,
            name: 'public'
        }, {
            id: 8,
            name: 'deleted'
        }];

        // TODO: should be sorted by occurence
        this.tags = {
            saved: _.map(this.availableTags, 'name'),
            selected: []
        };
        if (this.form.tags && this.form.tags.length) {
            // mapping existing tags to just array of names
            // only in case of editing existing note
            this.tags.selected = _.reduce(this.form.tags,
                function (result, tag) {
                    result.push(tag.name);
                    return result;
                },
            []);
        }

        this.typeaheadSelected = function () {
            if (this.tags.selected.indexOf(this.tags.newTag) >= 0) {
                pr('tag already exists');
            } else {
                this.tags.selected.push(this.tags.newTag);
            }

            this.tags.newTag = '';

        };

        this.cancelTag = function (tag) {
            if (!tag || this.tags.selected.indexOf(tag) < 0) {
                return false;
            }

            _.remove(this.tags.selected, function (t) {
                return t === tag;
            });
        };

        this.$onDestroy = function() {
            beforeUnload.deactivate();
        };
    },
};
