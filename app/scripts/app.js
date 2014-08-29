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
        when('/users', {
            controller: 'ManageUserCtrl',
            templateUrl: 'views/manageuser.html'
        }).
        when('/vnodes', {
            controller: 'ManageVNodeCtrl',
            templateUrl: 'views/managevnode.html'
        }).
        when('/pnodes', {     //managepnode view
            controller: 'ManagePNodeCtrl',
            templateUrl: 'views/managepnode.html'
        }).
        when('/tenants', {
            controller: 'ManageTenantCtrl',
            templateUrl: 'views/managetenant.html'
        }).
        when('/dcos', {
            controller: 'ManageDcoCtrl',
            templateUrl: 'views/managedco.html'
        }).
        when('/clusters', {
            controller: 'ManageClusterCtrl',
            templateUrl: 'views/managecluster.html'
        }).
        when('/jobs', {
            controller: 'ManageJobCtrl',
            templateUrl: 'views/managejob.html'
        }).
        when('/createtenant', {
            controller: 'CreateTenantCtrl',
            templateUrl: 'views/createtenant.html'
        }).
        when('/tenantextras', {
            controller: 'TenantExtrasCtrl',
            templateUrl: 'views/tenantextras.html'
        });
});


