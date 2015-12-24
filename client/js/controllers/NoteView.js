module.exports = function (
    $scope, $route, api, constants, commonMethods
) {
    'use strict';

    var id = $route.current.params.id;

    $scope.constants = constants;

    api.one('posts', id).get().then(function (data) {
        $scope.note = data;
    }, function (err) {
        console.error('fetching single post failure', err);
    });

    // updates important field of note
    $scope.updateImportance = function (importantValue) {
        commonMethods.updateImportance(id, importantValue).then(function () {
            $scope.note.important = importantValue;
        }, function (err) {
            console.error('updating important field failure', err);
        });
    };
};
