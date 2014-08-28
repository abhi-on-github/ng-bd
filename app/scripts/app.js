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
            controller: 'MainCtrl',
            templateUrl: 'views/main.html'
        }).
        when('/dashboard', {
            controller: 'DashboardCtrl',
            templateUrl: 'views/dashboard.html'
        }).
        when('/menu/:restaurantId', {
            controller: 'DashboardCtrl',
            templateUrl: 'views/menu.html'
        });
});


