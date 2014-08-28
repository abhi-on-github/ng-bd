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
        when('/manageuser', {
            controller: 'ManageUserCtrl',
            templateUrl: 'views/manageuser.html'
        }).
        when('/managevnode', {
            controller: 'ManageVNodeCtrl',
            templateUrl: 'views/managevnode.html'
        }).
        when('/managepnode', {     //managepnode view
            controller: 'ManagePNodeCtrl',
            templateUrl: 'views/managepnode.html'
        }).
        when('/managetenants', {
            controller: 'ManageTenantsCtrl',
            templateUrl: 'views/managetenants.html'
        }).
        when('/managedco', {
            controller: 'ManageDcoCtrl',
            templateUrl: 'views/managedco.html'
        }).
        when('/managecluster', {
            controller: 'ManageClusterCtrl',
            templateUrl: 'views/managedco.html'
        }).
        when('managejob', {
            controller: 'ManageJobCtrl',
            templateUrl: 'views/managejob.html'
        });
        when('tenantextras', {
            controller: 'TenantExtrasCtrl',
            templateUrl: 'views/tenantextras.html'
        });
});


