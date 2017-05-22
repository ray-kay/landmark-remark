(function () {

  'use strict';
  var app = angular.module('landmarkRemarkApp');

  app.controller('MapController',
    function ($scope, NgMap, LocationService, UserService, $localStorage) {

      var vm = this;

      //init map variable
      $scope.mapOptions = {
        loaded: false,
        scrollwheel: false,
        draggable: true,
        minZoomOnLoad: 12
      };

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
            initMapLoad(coords.latitude, coords.longitude, $scope.mapOptions.minZoomOnLoad);

            //add current user position
            $scope.newMarker = {
              id: 'new',
              isCurrentUser: true,
              text: '',
              userName: 'You',
              latitude: coords.latitude,
              longitude: coords.longitude,
              icon: "images/my-location-pin.png"
            };

          }, function (error) {
            console.log(res);
          });
      };
      getCurrentLocation();

      var initMapLoad = function(latitude, longitude, zoom) {
        NgMap.getMap().then(function (map) {
          $scope.mapOptions.loaded = true;

          map.setCenter({lat: latitude, lng: longitude});
          google.maps.event.clearListeners(map, 'zoom_changed');
          google.maps.event.clearListeners(map, 'dragend');

          vm.map = map;
        }, function(error){

        });
      };

      // When we click on the marker show the showInfoWindow
      $scope.onClickMarker = function (event, marker) {
        $scope.markerEditMode = false;
        if(vm.map) {

          //make sure to close current info window
          vm.map.hideInfoWindow('editableMarkerInfoWindow');
          vm.map.hideInfoWindow('markerInfoWindow');

          $scope.selectedMarker = marker;
          if(marker.isCurrentUser){
            if (!marker.text) {
              $scope.markerEditMode = true;
            }
            vm.map.showInfoWindow('editableMarkerInfoWindow', marker.id);
          }
          else{
            vm.map.showInfoWindow('markerInfoWindow', marker.id);
          }
        }
      };

      $scope.saveNote = function(marker){

        if(!$localStorage.sessionKey){
          UserService.showSignUpDialog()
        }

        LocationService.saveLocation($scope.selectedMarker).then(function (res) {
          $scope.markerEditMode = false;
        }, function (error) {
          $scope.markerEditMode = false;
        });
      };

      $scope.$on('userSignUp', function (context) {
        $scope.onClickMarker(null,$scope.newMarker);
      });

    }
  );
}());
