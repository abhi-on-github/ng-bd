'use strict';

/**
 * @ngdoc function
 * @name bluedataApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bluedataApp
 */
angular.module('bluedataApp')
  .controller('DashboardCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
