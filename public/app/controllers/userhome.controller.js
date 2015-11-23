'use strict';
angular.module("dmsApp")
  .controller('userCtrl', ['$scope','$rootScope','UserService', '$location', '$state', '$mdDialog',function($scope, $rootScope, UserService, $location, $state, $mdDialog){
    if (!localStorage.getItem('userToken')) {
      console.log('trigger home');
      $location.url('/home');
    }else{
    UserService.decodeUser();
      UserService.getCurrentUser($rootScope.userId).then(function(res) {
        $scope.user = res.data.user;
      });
    };

    $scope.toProfile = function(){
      $location.url('/userprofile');
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
        $location.url('/userhome');
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
    
    $scope.toCreateView = function() {
      $location.url('/createdoc');
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
