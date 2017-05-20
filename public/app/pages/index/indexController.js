(function () {

  'use strict';
  var app = angular.module('landmarkRemarkApp');

  app.controller('IndexController', ['$scope', 'NgMap', 'LocationService',
    function ($scope, NgMap, LocationService) {

      var vm = this;

      //init map variable
      $scope.mapOptions = {
        loaded: false,
        scrollwheel: false,
        draggable: true,
        minZoomOnLoad: 12
      };

      $scope.mapMarkers = [];
      $scope.markerEditMode = false;
      $scope.currentMarker = {
        id: 'marker-current',
        latitude: null,
        longitude: null,
        text: null
      };
      $scope.selectedMarker = {
        text: null
      };

      var getCurrentLocation = function () {
        LocationService.getCurrentLocation()
          .then(function (coords) {
            console.log(coords);
            initMapLoad(coords.latitude, coords.longitude, $scope.map.minZoomOnLoad);
          }, function (error) {
            console.log(res);/*
            var alert = {
              type: 'danger',
              title: 'Failure',
              description: 'Unable to estimate your current location'
            };
            broadcastService.send('showAppAlert', alert);*/
          });
      };
      //getCurrentLocation();

      var initMapLoad = function(latitude, longitude, zoom) {
        NgMap.getMap().then(function (map) {
          $scope.mapOptions.loaded = true;

          map.setZoom(zoom);
          //console.log(map.markers[0].getPosition());
          //map.setCenter(latitude, longitude);

          google.maps.event.clearListeners(map, 'zoom_changed');
          google.maps.event.clearListeners(map, 'dragend');

          vm.map = map;
        });
      };
      initMapLoad(0,0,$scope.mapOptions.minZoomOnLoad);

      // When we click on the marker show the showInfoWindow
      $scope.onClickCurrentMarker = function (event, marker) {
        var currentMarkerCoords = this.getPosition();
        currentMarkerCoords.lat();
        currentMarkerCoords.lng();

        $scope.selectedMarker = marker;
        if(!marker.text) {
          $scope.markerEditMode = true;
        }
        vm.map.showInfoWindow('currentMarkerInfoWindow', marker.id);
      };

      $scope.saveLocationNote = function(marker){
        console.log(marker);
        $scope.markerEditMode = false;
      }

    }
  ]);
}());
