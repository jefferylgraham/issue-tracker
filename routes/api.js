/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; 

var db;

module.exports = function (app) {
  MongoClient.connect(CONNECTION_STRING, function(err, database) {
    if (err) {
      return console.log(err);
    }
    
    db = database;
    
  });

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      var issue_title = req.body.issue_title;
      var issue_text = req.body.issue_text;
      var created_by = req.body.created_by;
      var assigned_to = req.body.assigned_to || '';
      var status_text = req.body.status_text  || '';
    
      if (issue_title && issue_text && created_by) {
        req.body.created_on = (new Date()).toString();
        req.body.updated_on = (new Date()).toString();
        req.body.open = true;
        
        db.collection('issue-tracker-db').save(req.body, (err, result) => {
          if (err) {
            return console.log(err);
          }
          return res.json({
            issue_title: issue_title,
            issue_text: issue_text,
            created_by: created_by,
            assigned_to: assigned_to,
            status_text: status_text,
            created_on: req.body.created_on,
            updated_on: req.body.updated_on,
            open: req.body.open
          });
        })
      }
      else {
        res.send('Missing required fields');
      }
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
