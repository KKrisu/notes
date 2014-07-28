angular.module('notes').service('api', function (Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('/api/v1/');
    });
});
