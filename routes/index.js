'use strict';
var userRoute = require('./user.routes');
var express = require('express');
var documentRoute = require('./document.routes');

module.exports = function(app) {
  userRoute(app);
  documentRoute(app);

  app.use(function(req, res, next) {
    res.status(404).json({error: "The path does not exists"});
    next();
  });
};
