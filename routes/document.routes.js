var express = require('express');
var docController = require('../controllers/document.controller');
var UserController = require('../controllers/user.controller');
var ctrl = new UserController();
var docCtrl = new docController();
var router = express.Router();


module.exports = function(app) {

  router.route('/documents')
    .post(docCtrl.createDocument)
    .get(docCtrl.getDocuments);

  router.route('/documents/:doc_id')
    .get(docCtrl.getCurrentDoc)
    .put(ctrl.verifyToken ,docCtrl.editDoc)
    .delete(ctrl.verifyToken, docCtrl.deleteCurrentDoc);

  router.route('/users/:u_id/documents')
    .get(ctrl.verifyToken, docCtrl.getMyDocs);

  app.use('/api', router);
};
