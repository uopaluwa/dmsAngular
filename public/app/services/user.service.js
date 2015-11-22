"use strict";
angular.module('dmsApp')
  .factory('UserService', ['$http', '$stateParams', '$location', '$rootScope', 'baseUrl', function($http, $stateParams, $location, $rootScope, baseUrl) {
    function urlBase64Decode(str) {
      var output = str.replace('-', '+').replace('_', '/');
      switch (output.length % 4) {
        case 0:
          break;
        case 2:
          output += '==';
          break;
        case 3:
          output += '=';
          break;
        default:
          throw 'Illegal base64url string!';
      }
      return window.atob(output);
    }
    
    return {
      createUser: function(param) {
        return $http.post("/api/users", param);
      },
      getCurrentUser: function(uId) {
        var token = localStorage.getItem('userToken');
        return $http.get("api/users/" + uId + '?token='+ token);
      },
      getAllUsers: function() {
        return $http.get("/api/users");
      },
      editProfile: function(user) {
        var token = localStorage.getItem('userToken');
        return $http.put("/api/users/"+user._id+"?token=" + token, user);
      },
      deleteUser: function(uId) {
        var token = localStorage.getItem('userToken');
        return $http.delete("api/users/"+ uId +"?token=" + token);
      },
      getUserDocs: function(uId) {
        var token = localStorage.getItem('userToken');
        return $http.get("/api/users/"+ uId +"/documents?token=" + token);
      },
      getCurrentDoc: function(docId) {
        return $http.get("/api/documents/"+ docId);
      },
      authenticate: function(param) {
        return $http.post("/api/users/login", param);
      },
      decodeUser: function() {
        if (localStorage.getItem('userToken')) {
          var token = localStorage.getItem('userToken');
          var user = {};
          if (token) {
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
            $rootScope.userName = user.firstname;
            $rootScope.userId = user._id;
            $rootScope.loggedIn = true;
          }
        }
      },
      createDoc: function(param) {
        var token = localStorage.getItem('userToken');
        return $http.post("/api/documents?token=" + token, param);
      },
      editDoc: function(doc) {
        var token = localStorage.getItem('userToken');
        return $http.put("/api/documents/"+doc._id+"?token=" + token, doc);
      },
      deleteDoc: function(doc_id) {
        var token = localStorage.getItem('userToken');
        return $http.delete("/api/documents/"+ doc_id +"?token=" + token);
      }
    };

  }]);
