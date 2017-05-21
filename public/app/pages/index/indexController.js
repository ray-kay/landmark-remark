(function () {

  'use strict';
  var app = angular.module('landmarkRemarkApp');

  app.controller('IndexController', ['$scope', 'NgMap', 'LocationService', 'UserService', '$localStorage',
    function ($scope, NgMap, LocationService, UserService, $localStorage) {

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
        id: null,
        latitude: null,
        longitude: null,
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

        $scope.selectedMarker = marker;
        $scope.selectedMarker.latitude = currentMarkerCoords.lat();
        $scope.selectedMarker.longitude = currentMarkerCoords.lng();
        if(!marker.text) {
          $scope.markerEditMode = true;
        }
        vm.map.showInfoWindow('currentMarkerInfoWindow', marker.id);
      };

      $scope.saveLocationNote = function(marker){
        console.log($scope.selectedMarker);

        LocationService.saveLocation($scope.selectedMarker).then(function (res) {
          console.log(res);
          //toaster.pop('success', "Record successfully updated");
          $scope.markerEditMode = false;
        }, function (error) {
          $scope.markerEditMode = false;
          //toaster.pop('danger', error.data.message);
        });
      };

      //check if user is authenticated, if not show dialog
      if(!$localStorage.sessionKey){
        UserService.showSignUpDialog()
      }
    }
  ]);
}());
