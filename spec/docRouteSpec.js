'use strict';
var mongoose = require('mongoose');
var Document = require('../models/document');
var User = require('../models/user');
var app = require('../server');
var request = require('request');
var doc, user, uId, docId, token, secondDoc;

var base_url = "http://localhost:8080/api/documents";

describe("Route Tests", function() {

  beforeEach(function(done) {
    user = new User();
    user.username = 'matt';
    user.name.first = 'flamin';
    user.name.last = 'Mat';
    user.email = 'mat@gmail.com';
    user.password = 'mattdam';
    doc = new Document();
    doc.title = 'The Hobbit';
    doc.content = 'this is a document.';
    user.save(function(err, user) {
      uId = user._id;
      doc.ownerId = uId;
      doc.save(function(err, doc) {
        docId = doc._id;
      });
      done();
    });
  });

  afterEach(function(done) {
    User.remove({}, function(err) {
      Document.remove({}, function(err) {});
      done();
    });
  });

  describe("Document routes", function() {
    it("GET /documents should return all documents", function(done) {
      request.get(base_url, function(error, response, body) {
        var docs = JSON.parse(body);
        expect(response.statusCode).toBe(200);
        expect(docs.length).toBe(1);
        expect(docs[0].title).toBe('The Hobbit');
        done();
      });
    });

    it("POST /documents should create new document", function(done) {
      var newDoc = {
        "title" : "Monte Cristo",
        "content" : "strange story",
        "ownerId": "4687abv009"
      };
      request({ method: 'POST', uri: base_url, json: newDoc},
      function(err, response, body) {
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe('Monte Cristo');
        expect(response.body.content).toBe('strange story');
        done();
      })
    });

    it("GET /users/:doc_id/documents return all user docs", function(done) {
      var bEachUser = {"password" : "mattdam","email": "mat@gmail.com"};
      secondDoc = new Document();
      secondDoc.title = 'Harry Potter';
      secondDoc.content = 'wizardry for kids.';
      secondDoc.ownerId = uId;
      secondDoc.save(function(err, doc) {
        request({ method: 'POST', uri: "http://localhost:8080/api/users/login", json: bEachUser},
        function(err, response, body) {
          token = JSON.parse(JSON.stringify(body));
          request({ method: 'GET', headers: {u_id: uId, 'x-access-token': token.token},uri: "http://localhost:8080/api/users/"+uId+"/documents"},
          function(error, response, body) {
              var userDocs = JSON.parse(body);
              expect(response.statusCode).toBe(200);
              expect(userDocs.length).toEqual(2);
              expect(userDocs[0].title).toBe('The Hobbit');
              expect(userDocs[1].title).toBe('Harry Potter');
              done();
            });
        })
      });
    });

    it("GET /documents/:doc_id returns doc with id: doc_id", function(done) {
      var secondDoc, newguy;
      secondDoc = new Document();
      secondDoc.title = 'A Song of Ice and Fire.';
      secondDoc.content = 'Quite a show.';
      secondDoc.ownerId = uId;
      secondDoc.save(function(err, doc) {
        request({ method: 'GET', headers: {doc_id: docId},uri: base_url + '/' + docId},
          function(error, response, body) {
            var selectedDoc = JSON.parse(body);
            expect(response.statusCode).toBe(200);
            expect(selectedDoc.title).toBe('The Hobbit');
            expect(selectedDoc.content).toBe('this is a document.');
            done();
          });
      });
    });

    it("PUT /documents/:doc_id edits specific user", function(done) {
      var thetoken;
      var bEachUser = {"password" : "mattdam", "email": "mat@gmail.com"};
      request({ method: 'POST', uri: "http://localhost:8080/api/users/login", json: bEachUser}).on('response', function(response) {
        response.on('data', function(data) {
          thetoken = JSON.parse(data);
          request({ method: 'PUT', headers: {doc_id: docId, 'x-access-token': thetoken.token},uri: base_url+'/'+docId,
          json: {"title": "Desolation of Smaug"}}, function(error, response, body) {
              var editedDoc = JSON.parse(JSON.stringify(body));
              expect(response.statusCode).toBe(200);
              expect(editedDoc.title).toBe('Desolation of Smaug');
              expect(editedDoc.content).toBe('this is a document.');
              done();
            });
        })
      });
    });

    it("DELETE /documents/:doc_id deletes specific document", function(done) {
      var thetoken;
      var bEachUser = {"password" : "mattdam", "email": "mat@gmail.com"};
      request({ method: 'POST', uri: "http://localhost:8080/api/users/login", json: bEachUser}).on('response', function(response) {
        response.on('data', function(data) {
          thetoken = JSON.parse(data);
          request({ method: 'DELETE', headers: {doc_id: docId, 'x-access-token': thetoken.token},uri: base_url+'/'+docId},
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
