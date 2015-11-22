'use strict';
angular.module("dmsApp")
  .controller('homeCtrl', ['$scope','$rootScope','UserService', '$location', '$state', function($scope, $rootScope,UserService, $location, $state){
    $rootScope.signupCheck = function() {
      if (localStorage.getItem('userToken')) {
        $location.url('/userhome');
      }
    };
    
    $scope.login = function(user){
      UserService.authenticate(user).then(function(res) {
        if (res.data.message === 'Authentication failed. User not found.') {
          $scope.wrongEmail = true;
          $scope.wrongPassword = false;
        } else if (res.data.message === 'Authentication failed. Wrong password.') {
          $scope.wrongEmail = false;
          $scope.wrongPassword = true;
        } else {
          localStorage.setItem('userToken', res.data.token);
          UserService.decodeUser();
          $location.url('/userhome');
        }
      });
    };

    $scope.signUp = function(user){
      UserService.createUser(user).then(function(res) {
          if (res.data.message === 'user email taken') {
            $scope.wrongEmail = true;
            $scope.wrongPassword = false;
          } else if(res.data.message === 'username taken'){
            $scope.wrongUsername = true;
          } else if(res.data.message === 'user account created'){
            $scope.login({email: user.email, password: user.password});
          }
      });
    };

  }]);
