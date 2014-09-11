angular.module('notes').service('constants', function () {
    'use strict';

    return {
        notes: {
            statuses: {
                0: 'draft',
                1: 'active',
                8: 'deleted'
            }
        }
    };
});
