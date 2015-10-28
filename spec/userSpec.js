'use strict';
var User = require('../models/user');
var user;
var config = require('../config');

describe('User Model', function() {
  beforeEach(function(done) {
    User.remove({}, function(err) {
      done();
    });
  });

  afterEach(function(done) {
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
      user.username = 'matty';
      user.name.first = 'hilly';
      user.name.last = '';
      user.email = 'matt@gmail.com';
      user.password = 'mattdame';
      user.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });

    it('should not accept entry without email', function(done) {
      user.username = 'matty';
      user.name.first = 'hilly';
      user.name.last = 'matt';
      user.email = '';
      user.password = 'mattdame';
      user.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });

    it('should not accept entry without password', function(done) {
      user.username = 'matty';
      user.name.first = 'hilly';
      user.name.last = 'matt';
      user.email = 'matt@gmail.com';
      user.password = '';
      user.save(function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });

    it('should accept entry when above fields are completed', function(done) {
      user.username = 'matty';
      user.name.first = 'hilly';
      user.name.last = 'matt';
      user.email = 'matt@gmail.com';
      user.password = 'mattdame';
      user.save(function(err) {
        expect(err).toBe(null);
        done();
      });
    });
  });
});
