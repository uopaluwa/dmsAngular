'use strict';
var mongoose = require('mongoose');
var Document = require('../models/document');
var User = require('../models/user');
var app = require('../server');
var request = require('request');
var doc, user, uId, token;

var base_url = "http://localhost:8080/api/users";

describe("Route Tests", function() {

  beforeEach(function(done) {
    user = new User();
    user.username = 'matt';
    user.name.first = 'flamin';
    user.name.last = 'Mat';
    user.email = 'mat@gmail.com';
    user.password = 'mattdam';
    user.save(function(err, user) {
      uId = user._id;
      done();
    });
  });

  afterEach(function(done) {
    User.remove({}, function(err) {
      done();
    });
  });

  describe("User route", function() {
    it("GET /users should return all users", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).length).toBe(1);
        done();
      });
    });

    it("POST /users should create new user", function(done) {
      var newPerson = {
        "username" : "second",
        "password" : "psec",
        "email": "psec@gmail.com",
        "name" : {
            "first": "another",
            "last": "person"
        }
      };
      request({ method: 'POST', uri: base_url, json: newPerson},
      function(err, response, body) {
        expect(response.statusCode).toBe(200);
        expect(response.body.username).toBe('second');
        expect(response.body.name.last).toBe('person');
        done();
      })
    });

    it("POST /users/login authenticate and issue token", function(done) {
      var bEachUser = {
        "password" : "mattdam",
        "email": "mat@gmail.com",
      };
      request({ method: 'POST', uri: base_url+"/login", json: bEachUser},
      function(err, response, body) {
        token = body.token;
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeTruthy();
        done();
      })
    });

    it("GET /users/:u_id returns specific user", function(done) {
      var second, newguy;
      second = new User();
      second.username = 'atl';
      second.name.first = 'lambo';
      second.name.last = 'city';
      second.email = 'atl@gmail.com';
      second.password = 'atlcity';
      second.save(function(err, user) {
        request({ method: 'GET', headers: {u_id: uId, 'x-access-token': token},uri: base_url+'/'+uId},
          function(error, response, body) {
            var currentUser = JSON.parse(body);
            expect(response.statusCode).toBe(200);
            expect(currentUser.user.username).toBe('matt');
            done();
          });
      });
    });

    it("PUT /users/:u_id edits specific user", function(done) {
      var thetoken;
      var bEachUser = {"password" : "mattdam", "email": "mat@gmail.com"};
      request({ method: 'POST', uri: base_url+"/login", json: bEachUser}).on('response', function(response) {
        response.on('data', function(data) {
          thetoken = JSON.parse(data);
          request({ method: 'PUT', headers: {u_id: uId, 'x-access-token': thetoken.token},uri: base_url+'/'+uId,
          json: {"email": "nikitude@aol.com"}}, function(error, response, body) {
              var currentUser = JSON.parse(JSON.stringify(body));
              expect(response.statusCode).toBe(200);
              expect(currentUser.user.email).toBe('nikitude@aol.com');
              done();
            });
        })
      });
    });

    it("DELETE /users/:u_id deletes specific user", function(done) {
      var thetoken;
      var bEachUser = {"password" : "mattdam", "email": "mat@gmail.com"};
      request({ method: 'POST', uri: base_url+"/login", json: bEachUser}).on('response', function(response) {
        response.on('data', function(data) {
          thetoken = JSON.parse(data);
          request({ method: 'DELETE', headers: {u_id: uId, 'x-access-token': thetoken.token},uri: base_url+'/'+uId},
            function(error, response, body) {
              var output = JSON.parse(body);
              expect(response.statusCode).toBe(200);
              expect(output.message).toBe('Succesfully deleted');
              done();
            });
        })
      });
    });

  });

});
