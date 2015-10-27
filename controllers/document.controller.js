'use strict';
var express = require('express');
var mongoose = require('mongoose');
var config = require('../config');
var Document = require('../models/document');
var jwt = require('jsonwebtoken');



var DocumentController = function() {};


DocumentController.prototype.createDocument = function(req, res) {
  if ( !req.body.title) {
    return res.status(422).send({
      success: false,
      message: 'Check parameters!'
    });
  }
  Document.findOne({
    title: req.body.title
  }, function(err, doc) {
    if (err) {
      return res.json(err);
    } else if (doc) {
      res.json({
        success: false,
        message: 'this doc title is taken'
      });
    } else {
      Document.create(req.body, function(err, doc) {
        if (err) {
          return res.json(err);
        }
        return res.json(doc);
      });
    }
  });
};

DocumentController.prototype.getDocuments = function(req, res) {
  Document.find(function(err, docs) {
    if (err) {
      return res.json(err);
    }
    return res.json(docs);
  });
};

DocumentController.prototype.editDoc = function(req, res) {
  Document.findOneAndUpdate({
    _id: req.headers['doc_id'], ownerId: req.decoded._id
  }, req.body, {
    new: true
  }, function(err, doc) {
    if (err) {
      return res.json(err);
    }else if(!doc){
      res.json({
        success: false,
        message: 'Unauthorised'
      });
    }
    else {
      return res.json(doc);
    }

  });
};

DocumentController.prototype.getCurrentDoc = function(req, res) {
  Document.findById(req.headers['doc_id'], function(err, doc) {
    if (err) {
      res.status(500).send(err);
    }
 else if(doc) {
      res.json(doc);
    } else {
      res.json({
        success: false,
        message: 'Document not found'
      });
    }
  });
};

DocumentController.prototype.deleteCurrentDoc = function(req, res) {

  var docId = req.headers['doc_id'];

  Document.findOne({_id: docId, ownerId: req.decoded._id}, function(err, doc) {

    if (err) {
      return res.status(500).send(err);
    } else if(doc) {

                  Document.remove({
                    _id: docId
                  }, function(err, doc) {
                    if (err) return res.status(500).send(err);

                    res.json({
                      message: 'Succesfully deleted'
                    });

                  });

    } else {

      return res.status(422).send({
        success: false,
        message: 'Document not found in db'
      });
    }
  });
};

DocumentController.prototype.getMyDocs = function(req, res) {
  Document.find({ ownerId: req.headers['u_id']}, function(err, docs) {
    if (err) {
      return res.json(err);
    }
    return res.json(docs);
  });
};

module.exports = DocumentController;
