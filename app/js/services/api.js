angular.module('notes').service('api', function (Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('http://localhost:9000/api/v1/');
    });
});
