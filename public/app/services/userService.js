(function () {

  'use strict';
  var app = angular.module('landmarkRemarkApp');

  app.factory('UserService',
    function ($q, $http, $mdDialog, $localStorage, broadcastService) {

      var saveUser = function (userName) {
        var deferred = $q.defer();
        var requestURL = '/api/user';

        $http.post(requestURL, {
          user: {
            user_name: userName
          }
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

      var showSignUpDialog = function () {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
          .title('Welcome to Landmark Remark!')
          .textContent('We just need a user name to set you up.')
          .placeholder('User name')
          .ariaLabel('User name')
          //.required(true) //coming in angular material 1.1.5 @see https://github.com/angular/material/pull/10626
          .ok('Lets start!');

        $mdDialog.show(confirm).then(function(userName) {
          if(userName) {
            saveUser(userName).then(function (res) {
              if (res.data.success) {
                $localStorage.sessionKey = res.data.data.session_key;
                $localStorage.userName = userName;
                broadcastService.send('userSignUp');
              }
            }, function (error) {
            });
          }
          else{
            showSignUpDialog(); //workaround until required flag is implemented
          }
        }, function(error) {});
      };

      return {
        saveUser: saveUser,
        showSignUpDialog: showSignUpDialog
      };
    }
  );
}());
