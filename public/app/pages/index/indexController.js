(function () {

  'use strict';
  var app = angular.module('landmarkRemarkApp');

  app.controller('IndexController',
    function ($scope, $timeout, $mdSidenav, $localStorage, UserService, LocationService) {
      $scope.mapMarkers = [];
      $scope.searchText = '';

      $scope.searchFilter = function(item) {
        return (!$scope.searchText || (item.text.toLowerCase().indexOf($scope.searchText) != -1) ||
          (item.userName.toLowerCase().indexOf($scope.searchText.toLowerCase()) != -1) );
      };

      $scope.toggleSidebar = buildDelayedToggler('left');

      $scope.closeSidebar = function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('left').close()
          .then(function () {});
      };

      function loadLocations() {
        LocationService.getList().then(function (res) {
          if(res.data.success) {
            //add location markers
            res.data.data.forEach(function (location,index) {
              $scope.mapMarkers.push({
                id: 'location-' + (index + 1),
                isCurrentUser: location.isCurrentUser,
                text: location.text,
                userName: location.userName,
                latitude: location.latitude,
                longitude: location.longitude
              });
            });
          }
        }, function (error) {
          console.log('error', error);
        });
      }

      //check if user is authenticated, if not show dialog
      if(!$localStorage.sessionKey){
        UserService.showSignUpDialog();
      }
      else{
        loadLocations();
      }

      // Listen to the broadcast message 'userSignUp' to
      $scope.$on('userSignUp', function (context) {
        loadLocations();
      });

      /**
       * Supplies a function that will continue to operate until the
       * time is up.
       */
      function debounce(func, wait, context) {
        var timer;

        return function debounced() {
          var context = $scope,
            args = Array.prototype.slice.call(arguments);
          $timeout.cancel(timer);
          timer = $timeout(function() {
            timer = undefined;
            func.apply(context, args);
          }, wait || 10);
        };
      }

      /**
       * Build handler to open/close a SideNav; when animation finishes
       * report completion in console
       */
      function buildDelayedToggler(navID) {
        return debounce(function() {
          // Component lookup should always be available since we are not using `ng-if`
          $mdSidenav(navID)
            .toggle()
            .then(function () {});
        }, 200);
      }
    }
  )
}());
