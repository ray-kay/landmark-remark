(function () {

  'use strict';
  var app = angular.module('landmarkRemarkApp');

  app.factory('LocationService', ['$q', '$rootScope', '$window', '$http',
    function ($q, $rootScope, $window, $http) {

      // Will request the user to allow access to browser's navigator
      // If user allows access, it will return the coordinates
      var getGEOLocation = function (timeout) {
        var deferred = $q.defer();

        var errors = {
          'unsupportedBrowser': 'Browser does not support location services',
          'permissionDenied': 'User rejected access to location',
          'positionUnavailable': 'Unable to determine user location',
          'timeout': 'Service timeout has been reached'
        };

        //@see: https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
        var geolocationOptions = {
          //enableHighAccuracy: true,
          timeout: timeout ? timeout : 10000, //max 10sec
          maximumAge: 900000 //caching time in ms 1000 * 60 * 15 = 15min = 900000
        };

        if ($window.navigator && $window.navigator.geolocation) {
          $window.navigator.geolocation.getCurrentPosition(function (position) {
            $rootScope.$apply(function () {
              deferred.resolve(position.coords);
            });
          }, function (error) {

            switch (error.code) {
              case 1:
                $rootScope.$apply(function () {
                  deferred.reject(errors.permissionDenied);
                });
                break;
              case 2:
                $rootScope.$apply(function () {
                  deferred.reject(errors.positionUnavailable);
                });
                break;
              case 3:
                $rootScope.$apply(function () {
                  deferred.reject(errors.timeout);
                });
                break;
            }
          }, geolocationOptions);
        } else {
          $rootScope.$apply(function () {
            deferred.reject({
              success: false,
              message: errors.unsupportedBrowser
            });
          });
        }
        return deferred.promise;
      };

      /**
       *
       * @param timeout
       * @returns {*}
       */
      var getCurrentLocation = function (timeout) {
        var deferred = $q.defer();

        getGEOLocation(timeout).then(function (coords) {
          deferred.resolve(coords);
          /*
          uiGmapGoogleMapApi.then(function () {
            var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({
              'latLng': latlng
            }, function (results, status) {
              if (status == "OVER_QUERY_LIMIT") {
                var error = "getGEOLocation - OVER_QUERY_LIMIT";
                deferred.reject(error);
              } else if (status !== google.maps.GeocoderStatus.OK) {
                var error = "getGEOLocation - Unable to get user's complete address";
                deferred.reject(error);
              } else {
                var place = results[0];
                if (place.address_components) {
                  var country = place.address_components.find(function (data) {
                    return data.types.find(function (data) {
                      return data === 'country';
                    })
                  });
                  var city = place.address_components.find(function (data) {
                    return data.types.find(function (data) {
                      return data === 'locality';
                    })
                  });
                  // Adding the longitude and latitude fields
                  location.country = country.long_name;
                  location.city = city.long_name;
                  location.longitude = coords.longitude;
                  location.latitude = coords.latitude;

                  deferred.resolve(location);
                } else {
                  var error = "getGEOLocation - Unable to get user's complete address";
                  deferred.reject(error);
                }
              }
            });
          }, function (error) {
            deferred.reject(error); //'Get user location GMaps API error');
          });*/

        }, function (error) {
          deferred.reject(error);
        });

        return deferred.promise;
      };

      var saveLocation = function (location) {
        var deferred = $q.defer();
        var requestURL = '/api/location';

        $http.post(requestURL, {
          location: location
        }).then(function (res) {
          if (res.data.success) {
            deferred.resolve(res);
          } else {
            deferred.reject(res);
          }
        }, function (error) {
          deferred.reject(error);
        });

        return deferred.promise;
      };

      return {
        getCurrentLocation: getCurrentLocation,
        saveLocation: saveLocation
      };
    }
  ]);
}());
