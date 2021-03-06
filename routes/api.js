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
      var filter = req.query;
      db.collection('issue-tracker-db').find(filter).toArray( function(err, results) {
        if (err) {
          console.log(err);
        }
        else {
          res.json(results);
        }
      });      
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
      var id = req.body._id;
    
      var inputs = req.body;
      var toBeUpdated = {};
    
      const keys = Object.keys(inputs);
    
      for (const key of keys) {
        if (inputs[key] != '') {
          toBeUpdated[key] = inputs[key];
        }
      }
      delete toBeUpdated._id;
    
      var size = Object.keys(toBeUpdated).length;
      
      if (size == 0) {
        return res.send('no updated field sent');
      }
    
      
      var o_id = new ObjectId(id);
  
      toBeUpdated.updated_on = new Date().toString();
      db.collection('issue-tracker-db').update({_id: o_id},  {$set: toBeUpdated}, function(err, result) {
        if (err) {
          return res.send('could not update ' + o_id);
        }
        return res.send('successfully updated');
      });
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      var id = req.body._id;
    
      if (id == '') {
        res.send('_id error');
      }
    
      var o_id = new ObjectId(id);
    
      db.collection('issue_tracker-db').deleteOne({_id: o_id}, function(err, result) {
        if(err) {
          res.json({failed: 'could not delete '+ o_id});
        }
        else {
          res.json({success: 'deleted '+ o_id});
        }
      })
      
    });
    
};
