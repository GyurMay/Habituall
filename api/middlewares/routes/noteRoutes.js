const express = require("express");

const Users = require("../../models/User");
const Habit = require("../../models/Habit");
const Note = require("../../models/Note");
// const passport = require("t");
const passport = require('../authentication');
const Comment = require("../../models/Comment");
// const { randomString } = require("../..");
const randomString = () => Array.from({length:10}, () => Math.random().toString(36).charAt(2)).join('');

const router = express.Router();


router.get("/:makeHabit",
passport.isAuthenticated(),
(req, res) => {
  const makeHabit = req.params.makeHabit;
  Note.find({makeHabit, userId: req.session.passport.user})
    .then(doc => {  
      res.status(200).json(doc);
    }).catch(e => {
      res.status(500).json({error:e})
    });
})


router.post('/delete',
passport.isAuthenticated(),
(req, res) => {
  const {makeHabit, noteId} = req.body.content;
  Note.updateOne(
    {userId: req.session.passport.user, makeHabit},
    {$pull: {notes: {noteId}}} 
    ).then(doc => {
      if(!doc) res.status(500).json({"error": e});
      res.status(200).json(doc);
    }).catch(e => res.status(500).json({"error":e}))
});


router.post('/create',
passport.isAuthenticated(),
(req, res) => {
  //works for both create and update
  console.log("req body create note", req.body.content)
  
  const noteObj = req.body.content;
  const makeHabit = req.body.makeHabit;
  const {note, date, done} = noteObj;
  // let updateQuery;

  const updateNote = (noteExist) => {
    const noteId = randomString();
    let findQuery = {userId: req.session.passport.user, makeHabit };
    let updateQuery =  { //assuming note doesnt exist - first note of the day
      $push: {
        notes: {
          noteId,
          date, note, done
        }
      }
    };  

    if(noteExist){  //change findQuery and updateQuery
      findQuery = {...findQuery, notes: {$elemMatch: {date}}};
      console.log("noteexist updating", findQuery)
      
      updateQuery =  {
        $set: {
          "notes.$.note": note,
          "notes.$.done": done
          }
        };
    }
    console.log("creating note with", findQuery, updateQuery)
    Note.updateOne(findQuery, 
      updateQuery
      ).then(d => {
        console.log("note update", d);
        if(!noteExist){ //create comment for first note too
          Comment.create({noteId}).then(d => {
            console.log("notes comment created", d)
            res.status(200).json(d); //returned alrwady double return error
            if(!d) res.status(200).json({error: d});
            return;
          });
        }else{
          res.status(200).json(d);
        }

      }).catch(error => {
        res.status(500).json(error);
      });
  };

  Note.findOne({
    userId: req.session.passport.user,
    makeHabit,
    notes: {$elemMatch: { date: date }}
  },
  {
    "notes.$": 1
  }
  ).then(doc => {
      console.log("note create find", doc)
      updateNote(!!doc); //turn this object to a boolean, says doc is true i.e note with given date found
    }).catch(e => res.json({"error":e})); 

  // console.log("noteExist", noteExist, query);
});

// Habit.updateOne()

module.exports = router;
