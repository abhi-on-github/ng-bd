'use strict';

/**
 * @ngdoc overview
 * @name bluedataApp
 * @description
 * # bluedataApp
 *
 * Main module of the application.
 */
var bluedataApp = angular.module('bluedataApp', ['ngResource']);

bluedataApp.config(function($routeProvider) {

    $routeProvider.
        when('/', {
            controller: 'dashboard',
            templateUrl: 'views/dashboard.html'
        }).
        when('/menu/:restaurantId', {
            controller: 'MenuController',
            templateUrl: 'views/menu.html'
        });
});


