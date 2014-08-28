'use strict';

bluedataApp.directive('navbar', function () {
    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/navbar.html',
        scope: {},
        controller: function navbarController($scope) {

            $scope.stats_data = {
                num_sessions: 2
            };
        }
    };
});
