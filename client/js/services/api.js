module.exports = function (Restangular, growl) {
    'use strict';

    return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('/api/v1/');

        RestangularConfigurer.setErrorInterceptor(function (response, deferred, responseHandler) {
            growl.error('API ERROR: ' + response.status + ' ' + response.statusText);
            return true; // error not handled
        });
    });
};
