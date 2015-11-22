describe('Controllers', function(){
	var ctrl, $scope, user, $location, httpBackend, UserService;
	var token = undefined;
	user = {
    "email": "liukang@aol.com",
    "password": "liu",
    "username": "liuk",
    "name.first": "liu",
    "name.last" : "kang"
	};
	beforeEach(function(){
		module('dmsApp');
	});

	beforeEach(inject(function($controller, $rootScope, _$location_, $httpBackend, _UserService_) { 
		$scope = $rootScope.$new();
		$location = _$location_;
		httpBackend = $httpBackend;
    UserService = _UserService_;
    spyOn(UserService, 'decodeUser');
		httpBackend.whenGET(/\.html$/).respond({
      success: true
    });
		ctrl = $controller('homeCtrl', {
        $scope: $scope
      });
		$scope.$digest();
  }));


 	afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('Home controller', function(){
  	it('signUp should create and login a user',function(){
  		httpBackend.expectPOST('/api/users',user).respond({message: 'user account created', success: true, user: user});
  		expect($scope.login).toBeDefined();
  		expect($scope.signUp).toBeDefined();
  		expect($scope.signupCheck).toBeDefined(); 
  		spyOn($scope, 'login');
  		$scope.signUp(user);
  		httpBackend.flush();
  		expect($scope.login).toHaveBeenCalled();
  		expect($scope.login).toHaveBeenCalledWith({email: user.email, password: user.password});
  	});

  	it('should login a user',function(){
  		httpBackend.expectPOST('/api/users/login',user).respond({success: true}); 
  		spyOn($location, 'url');
  		$scope.login(user);
			httpBackend.flush();
      expect(UserService.decodeUser).toHaveBeenCalled();
  		expect($location.url).toHaveBeenCalled();
  		expect($location.url).toHaveBeenCalledWith('/userhome');
  	});

	});
})