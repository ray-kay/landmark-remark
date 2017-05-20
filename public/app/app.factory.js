(function () {

  'use strict';
  // Initialise any application level factory/services
  angular.module('landmarkRemarkApp')
    // A helper library with many built in js utilities
    .factory('_', ['$window', function ($window) {
      return $window._;
    }])
    // Service to broadcast events around in the app
    .factory('broadcastService', ['$rootScope', function ($rootScope) {
      return {
        send: function (msg, data, flag) {
          $rootScope.$broadcast(msg, data, flag);
        }
      }
    }])
    .factory('psResponsive', ['$window', '$filter', '$rootScope', 'broadcastService',
      function ($window, $filter, $rootScope, broadcastService) {

        // Inspired by https://github.com/randallmeeker/psResponsive

        var opRegEx = /[<>]=?\s\w+/,
          forEach = angular.forEach,
          filter = angular.filter,
          sizes = [{
            name: 'xs-screen',
            minWidth: 0
          }, {
            name: 'sm-screen',
            minWidth: 768
          }, {
            name: 'md-screen',
            minWidth: 992
          }, {
            name: 'lg-screen',
            minWidth: 1200
          }];

        sizes = $filter('orderBy')(sizes, '-minWidth');

        var getHeight = function () {
            return $window.innerHeight;
          },

          getWidth = function () {
            return $window.innerWidth;
          },

          getLabel = function () {
            var cWidth = getWidth(),
              returnVal = false;
            for (var i = 0; i < sizes.length; i++) {
              if (parseInt(cWidth) >= parseInt(sizes[i].minWidth)) {
                return sizes[i].name;
              }
            }
          },
          getWidthFromLabel = function (label) {
            return $filter('filter')(sizes, {
              name: label
            }, true)[0]["minWidth"];
          },

          getTest = function (test) {
            var thingy = test.split(' ')[0],
              against = test.split(' ')[1];

            if (isNaN(against)) {
              return eval('(' + getWidth() + ' ' + thingy + ' ' + getWidthFromLabel(against) + ')');
            } else {
              return eval('(' + getWidth() + thingy + parseInt(against) + ')');
            }
          },

          getOrientation = function () {
            if (getHeight() > getWidth()) return 'portrait';
            else return 'landscape';
          };

        // Broadcast a message when window is resized
        angular.element($window).bind('resize', function () {
          broadcastService.send('windowResized', getLabel());
        });

        return function (onwha) {
          if (!onwha) {
            return getLabel();
          } else if (onwha == 'width') {
            return getWidth();
          } else if (onwha == 'height') {
            return getHeight();
          } else if (onwha == 'orientation') {
            return getOrientation();
          } else if (opRegEx.test(onwha)) {
            return getTest(onwha);
          } else {
            return (getLabel() == onwha);
          }
          return false;
        };
      }
    ])
  ;
}());
