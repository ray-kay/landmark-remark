(function () {

  'use strict';
  var app = angular.module('landmarkRemarkApp');

  app.directive('landmarkMap', [function () {
    return {
      restrict: 'AE',
      templateUrl: 'map/landmark-map.html',
      scope: true,
      transclude: false,
      controller: 'MapController'
    };
  }]);
}());
