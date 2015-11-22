'use strict';
angular.module("dmsApp")
  .controller('userCtrl', ['$scope','$rootScope','UserService', '$location', '$state', '$mdDialog',function($scope, $rootScope, UserService, $location, $state, $mdDialog){
    if (!localStorage.getItem('userToken')) {
      $location.url('/home');
    }else{
    UserService.decodeUser();
      UserService.getCurrentUser($rootScope.userId).then(function(res) {
        $scope.user = res.data.user;
      });
    };
    //fxn to show or hide user profile info
    $scope.visibility = true;
    $scope.toggleVisibility = function(){
      if($scope.visibility === true){
        $scope.visibility = false;
      } else {
        $scope.visibility = true;
      }
    }
    //fxn to enable/disable user profile for editing
    $scope.editMode = true;
    $scope.toggleMode = function(){
      $scope.editMode = !($scope.editMode);
    };

    $scope.editProfile = function(user){
      UserService.editProfile(user).then(function(res){
          $scope.user = res.data.user;
          localStorage.setItem('userToken', res.data.token);
          $scope.editMode = true;
      });
    };
    
    $scope.showEditModal = function(docId, editMode) {
      $rootScope.docId = docId;
      $rootScope.editMode = editMode;
      $mdDialog.show({
        controller: toEditView,
        templateUrl: '../../app/views/editview.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true
      })
    };

    function toEditView ($scope, $mdDialog, $rootScope){
      $scope.editMode = $rootScope.editMode;
      UserService.getCurrentDoc($rootScope.docId).then(function(res){
        $scope.doc = res.data;
      });

      $scope.editDoc = function(doc){
        UserService.editDoc(doc).then(function(res){
          $scope.cancel();
          location.reload();
        });
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    };

    $scope.fetchMyDocs = function(){
      UserService.getUserDocs($rootScope.userId).then(function(data){
        $scope.userDocs = data.data;
      });
    };

    $scope.createNewDoc = function(doc){
      doc.ownerId = $rootScope.userId;
      UserService.createDoc(doc).then(function(res) {
        $scope.fetchMyDocs();
      });
    };

    $scope.deleteUser = function(uId){
        UserService.deleteUser(uId).then(function(res){
          if(res.data.message === 'Succesfully deleted')
            $scope.logout();
        });
    };

    $scope.deleteDocument = function(id){
      UserService.deleteDoc(id).then(function(res){
        $scope.fetchMyDocs();
      });
    };
    
    $scope.showCreateModal = function() {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: '../../app/views/createdoc.view.html',
        parent: angular.element(document.body),
        clickOutsideToClose:false
      })
    };

    $scope.logout = function() {
      localStorage.removeItem('userToken');
      $rootScope.loggedIn = false;
      $location.url('/home');
    };

  }]);
  function DialogController($scope, $mdDialog, $rootScope, UserService) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.createNewDoc = function(doc){
      doc.ownerId = $rootScope.userId;
      UserService.createDoc(doc).then(function(res) {
        location.reload();
        $scope.cancel();
      });
    };
  }
