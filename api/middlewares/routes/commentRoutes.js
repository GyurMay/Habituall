const express = require("express");

const Users = require("../../models/User");
const Habit = require("../../models/Habit");
const Note = require("../../models/Note");
const Comment = require("../../models/Comment");
// const passport = require("t");
const passport = require('../authentication');

const router = express.Router();
const randomString = () => Array.from({length:10}, () => Math.random().toString(36).charAt(2)).join('');


router.get('/:noteId',
passport.isAuthenticated(),
(req, res) => {
  const {noteId} = req.params;
  console.log("finding for noteId", noteId)
  Users.find({userId: req.session.passport.user})
    .then(d => {
      // console.log("comdeldoc", d[0].name, d)
      Comment.find({noteId}, {userId: 0}).then(doc => {
        if(doc && doc[0]) doc[0].comments.forEach(x=>{ x.userId = null }); //hiding userId
        res.status(200).json({currUserName: d[0].name ,comment: doc})
      });
    })
});

router.post('/delete',
passport.isAuthenticated(),
 (req, res) => {
  const {commentId, noteId} = req.body;
  try{
    Comment.updateOne({noteId, "comments.userId": req.session.passport.user}, {$pull: {comments: {commentId}}})
    .then(doc => {
      console.log("resp comdel", doc)
      res.status(200).json(doc);
    });
  }
  catch(e){ 
    res.status(500).json({error:e})
  }

});
router.post('/new',
passport.isAuthenticated(),
(req, res) => {
  const {noteId, comment} = req.body;
  const commentId = randomString();
  try{
    Users.findOne({userId: req.session.passport.user}).then(d => {
      console.log("new comment", d)
      const name = d.name;
      const date =  new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      console.log(date, "date")

      
      Comment.updateOne({noteId}, {$push: {comments: {
        date: date.toString(),
        commentId, userId: req.session.passport.user,
        name, comment 
      }}}).then(d => {
        console.log(d, "com update")
        res.status(200).json(d)
      });
    })
  }catch(d){ res.status(200).json({error: d}) };

});


module.exports = router;
