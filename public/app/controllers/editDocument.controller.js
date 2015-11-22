'use strict';
angular.module("dmsApp")
  .controller('editCtrl', ['$scope','$rootScope','UserService', '$location','$state', '$stateParams', function($scope, $rootScope, UserService, $location, $state, $stateParams){
    UserService.getCurrentDoc($stateParams.doc_id).then(function(res){
      $scope.doc = res.data;
    });
    
    $scope.editMode = true;
    $scope.toggleMode = function(){
      $scope.editMode = !($scope.editMode);
    };

    $scope.deleteDocument = function(id){
      UserService.deleteDoc(id).then(function(res){
        $scope.fetchMyDocs();
      });
    }
    $scope.editDoc = function(doc){
      UserService.editDoc(doc).then(function(res){
        $state.go('userhome');
      });
    };
    $scope.logout = function() {
      localStorage.removeItem('userToken');
      $rootScope.loggedIn = false;
      $location.url('/home');
    };

  }]);
