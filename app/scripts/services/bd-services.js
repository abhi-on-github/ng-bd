/**
 * Define all REST API calls here
 */

'use strict';

bluedataApp.factory('Dashboard', function($resource) {
  return $resource(
      '/api/dashboard/:id',
      {
          id: '@id'
      });
});

bluedataApp.factory('Status', function($resource) {
  return $resource(
      '/api/status/:id',
      {
          id: '@id'
      });
});
