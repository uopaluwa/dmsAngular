'use strict';
var mongoose = require('mongoose');
var Document = require('../models/document');
var doc;
var config = require('../config');

// mongoose.connect(config.database);
// var db = mongoose.connection;
//
// db.on('error', function (err) {
//   console.log('connection error', err);
// });
// db.once('open', function () {
//   console.log('connected.');
// });

describe('Document Model', function() {
  beforeEach(function(done) {
    Document.remove({}, function(err) {
      done();
    });
  });

  afterEach(function(done) {
    Document.remove({}, function(err) {
      done();
    });
  });

  describe('Creating Document', function() {
    beforeEach(function(done){
      doc = new Document();
      done();
    });

    it('should not accept entry without ownerId', function(done) {
      doc.ownerId = '';
      doc.title = 'The Hobbit';
      doc.content = 'battle for middle earth.';
      doc.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });

    it('should not accept entry without title', function(done) {
      doc.ownerId = '2hiuhi79882';
      doc.title = '';
      doc.content = 'battle for middle earth.';
      doc.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });

    it('should accept entry without content', function(done) {
      doc.ownerId = '2hiuhi79882';
      doc.title = 'The Hobbit';
      doc.content = '';
      doc.save(function(err,newDoc) {
        expect(err).toBe(null);
        expect(newDoc).not.toBe(null);
        done();
      });
    });

    it('should accept entry when above fields are completed', function(done) {
      doc.ownerId = '2hiuhi79882';
      doc.title = 'The Hobbit and Orcs.';
      doc.content = 'Battle for middle earth.';
      doc.save(function(err, newDoc) {
        expect(err).toBe(null);
        expect(newDoc).not.toBe(null);
        //show that each created doc has dateCreated
        expect(newDoc.dateCreated).toBeTruthy();
        done();
      });
    });
  });
});
