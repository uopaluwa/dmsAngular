'use strict';
var mongoose = require('mongoose');
var User = require('../models/user');
var user;
var config = require('../config');
console.log("yo");
mongoose.connect(config.database);

describe('User Model', function() {
console.log('got here');
   beforeEach(function(done) {
      User.remove({}, function(err) {
        done();
      });

    });

  describe('Sign up', function() {
    beforeEach(function(done){
      user = new User();
      done();
    });

    it('should not accept entry without firstname', function(done) {

      user.username = 'matty';
      user.name.first = '';
      user.name.last = 'Matt';
      user.email = 'matt@gmail.com';
      user.password = 'mattdame';
      user.save(function(err) {
          expect(err).not.toBe(null);
      done();

      });
    });

    it('should not accept entry without lastname', function(done) {
      user.firstname = 'dame';
      user.lastname = '';
      user.email = 'matt@gmail.com';
      user.password = 'mattdame';
      user.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });

    it('should not accept entry without email', function(done) {
      user.firstname = 'dame';
      user.lastname = 'matt';
      user.email = '';
      user.password = 'mattdame';
      user.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });

    it('should not accept entry without password', function(done) {
      user.firstname = 'dame';
      user.lastname = 'matt';
      user.email = 'matt@gmail.com';
      user.password = '';
      user.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });

    it('should accept entry when above fields are completed', function(done) {
      user.firstname = 'dame';
      user.lastname = 'matt';
      user.email = 'matt@gmail.com';
      user.password = 'mattdame';
      user.save(function(err) {
        expect(err).toBe(null);
        done();
      });
    });

  });
});
