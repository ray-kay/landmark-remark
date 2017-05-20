(function () {

  'use strict';
  var app = angular.module('landmarkRemarkApp');

  app.controller('IndexController', ['$scope',
    function ($scope) {

      $scope.text = 'This is a first AngularJS test message';

    }
  ]);
}());
