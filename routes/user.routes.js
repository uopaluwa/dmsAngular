var express = require('express');
var UserController = require('../controllers/user.controller');
var docController = require('../controllers/document.controller');
var docCtrl = new docController();
var ctrl = new UserController();
var router = express.Router();

module.exports = function(app) {

  router.route('/users')
    .post(ctrl.createUser)
    .get(ctrl.getUsers);

  router.route('/users/login')
    .post(ctrl.authenticate);

  router.route('/users/logout')
    .post(ctrl.logoutUser);

  router.route('/users/:u_id')
    .get(ctrl.verifyToken, ctrl.getCurrentUser)
    .put(ctrl.verifyToken, ctrl.editUser)
    .delete(ctrl.verifyToken, ctrl.deleteCurrentUser);

  app.use('/api', router);
};
