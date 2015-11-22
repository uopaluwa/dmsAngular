describe('Controllers', function(){
  var $scope, UserService, controller, q, deferred, user, $mdDialog, $rootScope, $location, doc;
  user = {
    "email": "liukang@aol.com",
    "password": "liu",
    "username": "liuk",
    "name.first": "liu",
    "name.last" : "kang"
  };
  doc = {ownerId: 12, title: 'THIS LIFE', content: 'CODING SMH!!!!'};
  beforeEach(function(){
    module('dmsApp');
    inject(function(_$rootScope_, $controller, $q, _UserService_, _$mdDialog_, _$location_){
      $scope = _$rootScope_.$new();
      UserService = _UserService_;
      $mdDialog = _$mdDialog_;
      $rootScope = _$rootScope_;
      $location = _$location_;
      spyOn(UserService, 'editProfile').and.returnValue($q.when('weee'));
      spyOn(UserService, 'getUserDocs').and.returnValue($q.when('weee'));
      spyOn(UserService, 'createDoc').and.returnValue($q.when('weee'));
      spyOn(UserService, 'deleteUser').and.returnValue($q.when('weee'));
      spyOn(UserService, 'deleteDoc').and.returnValue($q.when('weee'));
      spyOn(UserService, 'decodeUser');
      spyOn($location, 'url');
      ctrl = $controller('userCtrl', {
        $scope: $scope,
        $location: $location,
        $rootScope: $rootScope
      });
    });
  });

  describe('userCtrl', function(){

    it('should toggle editMode',function(){
      expect($scope.editMode).toBe(true);
      expect($scope.visibility).toBe(true);
      expect($scope.toggleVisibility).toBeDefined();
      $scope.toggleMode();
      expect($scope.editMode).toBe(false);
    });

    it('should call userService.editProfile method',function(){
      expect($scope.editProfile).toBeDefined();
      $scope.editProfile(user);
      expect(UserService.editProfile).toHaveBeenCalled();
      expect(UserService.editProfile).toHaveBeenCalledWith(user);
    });

    it('should trigger md.dialog',function(){
      expect($scope.showEditModal).toBeDefined();
      spyOn($mdDialog, 'show');
      $scope.showEditModal();
      expect($mdDialog.show).toHaveBeenCalled();
    });

    it('should call userService.getUserDocs method',function(){
      $rootScope.userId = undefined;
      expect($scope.fetchMyDocs).toBeDefined();
      $scope.fetchMyDocs();
      expect(UserService.getUserDocs).toHaveBeenCalled();
      expect(UserService.getUserDocs).toHaveBeenCalledWith($rootScope.userId);
    });

    it('should call userService.createNewDoc method',function(){
      $rootScope.userId = undefined;
      expect($scope.createNewDoc).toBeDefined();
      $scope.createNewDoc(doc);
      expect(UserService.createDoc).toHaveBeenCalled();
      expect(UserService.createDoc).toHaveBeenCalledWith(doc);
    });

    it('should call userService.deleteUser method',function(){
      var uId;
      expect($scope.deleteUser).toBeDefined();
      $scope.deleteUser(uId);
      expect(UserService.deleteUser).toHaveBeenCalled();
      expect(UserService.deleteUser).toHaveBeenCalledWith(uId);
    });

    it('should call userService.deleteDoc method',function(){
      var id;
      expect($scope.deleteDocument).toBeDefined();
      $scope.deleteDocument(id);
      expect(UserService.deleteDoc).toHaveBeenCalled();
      expect(UserService.deleteDoc).toHaveBeenCalledWith(id);
    });

    it('should trigger md.dialog',function(){
      expect($scope.showCreateModal).toBeDefined();
      spyOn($mdDialog, 'show');
      $scope.showCreateModal();
      expect($mdDialog.show).toHaveBeenCalled();
    });

    it('should logout a user',function(){
      expect($scope.logout).toBeDefined();
      spyOn($scope, 'logout');
      $scope.logout();
      expect($location.url).toHaveBeenCalled();
    });

  });


});