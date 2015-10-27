'use strict';
var express = require('express');
var mongoose = require('mongoose');
var config = require('../config');
var User = require('../models/user');
var jwt = require('jsonwebtoken');



var UserController = function(passport) {
  UserController.passport = passport;
};


UserController.prototype.createUser = function(req, res) {
  if ( !req.body.email || !req.body.password) {
    return res.status(422).send({
      success: false,
      message: 'Check parameters!'
    });
  }
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) {
      return res.json(err);
    } else if (user) {
      res.json({
        success: false,
        message: 'user email taken'
      });
    } else {
      User.create(req.body, function(err, user) {
        if (err) {
          return res.json(err);
        }
        return res.json(user);
      });
    }
  });
};


UserController.prototype.authenticate = function(req, res) {
  User.findOne({
    email: req.body.email
  }).exec(function(err, user) {
    if (err)
      return res.json(err);

    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (req.body.password) {
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {
        var token = jwt.sign(user, config.secret, {
          expiresIn: 86400 //24hr expiration
        });
        //return info including token in JSON format
        return res.json({
          success: true,
          message: 'Enjoy your token',
          token: token
        });
      }
    } else {
      return;
    }
  });
};

UserController.prototype.verifyToken = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      }
      else {
        //if all checks are passed, save decoded info to request
        req.decoded = decoded;
        next();
      }
    });
}
  else {
    //show http 403 message when token is not provided
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
};

UserController.prototype.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err) {
      return res.json(err);
    }
    return res.json(users);
  });
};


UserController.prototype.editUser = function(req, res) {

  User.findByIdAndUpdate({
    _id: req.decoded._id
  }, req.body, {
    new: true
  }, function(err, user) {
    if (err) {
      return res.json(err);
    }
    var token = jwt.sign(user, config.secret, {
      expiresIn: 86400 //24hr expiration
    });

    return res.json({
      user: user,
      token: token
    });
  });
};

UserController.prototype.getCurrentUser = function(req, res) {
  User.findById(req.decoded._id, function(err, user) {
    if (err) {
      res.status(500).send(err);
    }
 else {
      res.json(user);
    }
  });
};

UserController.prototype.deleteCurrentUser = function(req, res) {

  var userId = req.decoded._id;

  User.findById(userId, function(err, user) {

    if (err) {
      return res.status(500).send(err);
    } else if(user) {

                  User.remove({
                    _id: userId
                  }, function(err, user) {
                    if (err) return res.status(500).send(err);

                    res.json({
                      message: 'Succesfully deleted'
                    });

                  });

    } else {

      return res.status(422).send({
        success: false,
        message: 'User not found in db'
      });
    }
  });
};

module.exports = UserController;
