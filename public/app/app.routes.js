(function () {

  'use strict';
  var app = angular.module('landmarkRemarkApp');

  // List of all the routes and their corresponding meta tags
  app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {

      $routeProvider
        .when('/', {
          templateUrl: 'index/index.html',
          controller: 'IndexController'
        })
        .otherwise('/');

      // To simulate the real world urls, without having #tag
      $locationProvider.html5Mode(true);
    }
  ]);
}());
