module.exports = function ($scope, api, growl) {
    'use strict';

    $scope.reconnectDb = function () {
        pr('reconnectDb');
        api.all('commands').post({command: 'reconnect_db'}).then(function () {
            growl.success('reconnecting');
        });
    };
};
