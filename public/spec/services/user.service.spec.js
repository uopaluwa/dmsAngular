describe('Services', function(){
	var UserService, httpBackend, user, user1, doc1, doc2;
	var token = undefined;
	user = {
    "email": "liukang@aol.com",
    "password": "liu",
    "username": "liuk",
    "name": {
        "first": "liu",
        "last" : "kang"
    }
	};
	user1 = {
    "email": "konglao@aol.com",
    "password": "lao",
    "username": "kong",
    "name": {
        "first": "kong",
        "last" : "lao"
    }
	};

	doc1 = {title: 'The Hobbit', content: 'A tale of a courage'};
	doc2 = {title: 'A song of Ice and Fire', content: 'Whitewalkers everywhere, and John Snow'};

  beforeEach(function(){
 	  module('dmsApp');

   	inject(function($httpBackend, _UserService_) {
        UserService = _UserService_;      
        httpBackend = $httpBackend;
    });
 	});

 	afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('User Service', function(){

  	it('should create a new user', function(){
  		httpBackend.expectPOST('/api/users',user).respond(200, {msg: 'user account created', success: true, user: user});
  		UserService.createUser(user).then(function(response){
  			expect(response.status).toBe(200);
  			expect(response.data.msg).toBe('user account created');
  			expect(response.data.user).toEqual(user);
  		});
  		httpBackend.flush();
  	});
  	
  	it('should get the current user using Id', function(){
  		var uId = 23;
  		httpBackend.expectGET('api/users/' + uId + '?token='+ token).respond(200, {user: user});
  		UserService.getCurrentUser(uId).then(function(response){
  			expect(response.status).toBe(200);
  			expect(response.data.user).toEqual(user);
  		});
  		httpBackend.flush();
  	});

  	it('should get all users', function(){
  		var users = [user,user1];
  		httpBackend.expectGET('/api/users').respond(200, users);
  		UserService.getAllUsers().then(function(response){
  			expect(response.status).toBe(200);
  			expect(response.data).toEqual([user,user1]);
  		});
  		httpBackend.flush();
  	});

  	it('should edit user profile', function(){
 			var editedUser = user;
 			editedUser.email = "fatality@aol.com";
 			editedUser._id = 24;
  		httpBackend.expectPUT("/api/users/"+editedUser._id+"?token=" + token, editedUser).respond(200, editedUser);
  		UserService.editProfile(editedUser).then(function(response){
  			expect(response.status).toBe(200);
  			expect(response.data.email).toEqual('fatality@aol.com');
  		});
  		httpBackend.flush();
  	});

  	it('should delete a user', function(){
 			var uId = 25;
  		httpBackend.expectDELETE("api/users/"+ uId +"?token=" + token).respond(200, {msg: 'Successfully deleted.'});
  		UserService.deleteUser(uId).then(function(response){
  			expect(response.status).toBe(200);
  			expect(response.data.msg).toEqual('Successfully deleted.');
  		});
  		httpBackend.flush();
  	});

  	it('should get a particular users documents', function(){
 			var uId = 25;
  		httpBackend.expectGET("/api/users/"+ uId +"/documents?token=" + token).respond(200, [doc1,doc2]);
  		UserService.getUserDocs(uId).then(function(response){
  			expect(response.status).toBe(200);
  			expect(response.data.length).toEqual(2);
  			expect(response.data[0].title).toBe('The Hobbit');
  			expect(response.data[1].content).toBe('Whitewalkers everywhere, and John Snow');
  		});
  		httpBackend.flush();
  	});

  	it('should get a particular document using documentID', function(){
 			var docId = 25;
  		httpBackend.expectGET("/api/documents/"+ docId).respond(200, doc1);
  		UserService.getCurrentDoc(docId).then(function(response){
  			expect(response.status).toBe(200);
  			expect(response.data.title).toBe('The Hobbit');
  			expect(response.data.content).toBe('A tale of a courage');
  		});
  		httpBackend.flush();
  	});

  	it('should authenticate user and issue token', function(){
  		var userLoginInfo = {email: 'subzero@aol.com', password: 'xxxxxx'};
  		httpBackend.expectPOST('/api/users/login', userLoginInfo).respond(200, {success: true, message: 'Enjoy your token',token: token});
  		UserService.authenticate(userLoginInfo).then(function(response){
  			expect(response.status).toBe(200);
  			expect(response.data.message).toEqual('Enjoy your token');
  			expect(response.data).toEqual(jasmine.objectContaining({token: token}));
  		});
  		httpBackend.flush();
  	});

  	it('should allow authenticated user to create a document', function(){
  		httpBackend.expectPOST("/api/documents?token=" + token, doc1).respond(200, doc1);
  		UserService.createDoc(doc1).then(function(response){
  			expect(response.status).toBe(200);
  			expect(response.data).toEqual(doc1);
  		});
  		httpBackend.flush();
  	});

  	it('should allow owner(authenticated user) to edit a document', function(){
  		var editedDoc = doc2;
  		editedDoc.title = 'The Phantom Menace.';
  		editedDoc._id = 66;
  		httpBackend.expectPUT("/api/documents/"+editedDoc._id+"?token=" + token, editedDoc).respond(200, {msg: 'edit successful', editedDoc: editedDoc});
  		UserService.editDoc(editedDoc).then(function(response){
  			expect(response.status).toBe(200);
  			expect(response.data.msg).toEqual('edit successful');
  			expect(response.data.editedDoc).toEqual(editedDoc);
  			expect(response.data.editedDoc.content).toEqual('Whitewalkers everywhere, and John Snow');
  		});
  		httpBackend.flush();
  	});

  	it('should allow owner(authenticated user) to delete a document', function(){
  		var doc_id = 66;
  		httpBackend.expectDELETE("/api/documents/"+doc_id+"?token=" + token).respond(200, {msg: 'Successfully deleted'});
  		UserService.deleteDoc(doc_id).then(function(response){
  			expect(response.status).toBe(200);
  			expect(response.data.msg).toEqual('Successfully deleted');
  		});
  		httpBackend.flush();
  	});

	});
})