angular.module('notes').service('api', function (Restangular) {
    'use strict';

    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('/api/v1/');
    });
});
