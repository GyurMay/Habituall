const express = require("express");

const Users = require("../../models/User");
const Habit = require("../../models/Habit");
const Note = require("../../models/Note");
// const passport = require("t");
const passport = require('../authentication');

const router = express.Router();


const deleteAllEntity = (params,req,res) => {
    const {fetchQuery, model} = params;
    model.deleteOne(fetchQuery)
      .then(doc => {
        if(!doc) res.status(500).json({ error: error }); 
        res.status(200).json(doc);
      }).catch(error => {
        res.status(500).json({ error: error });
      });
  }
  
router.get("/", 
  passport.isAuthenticated(),
  (req, res) => {
    let uId = req.session.passport.user;
    console.log(uId, "/home")
    Habit.find({userId: uId})
    .then(docs => {
      res.status(200).json({
        message: 'Documents fetched successfully!',
        habits: docs
      });
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
});

router.get("/:id",
  passport.isAuthenticated(),
  (req, res) => {
  Habits.findOne({habits: {$elemMatch: { habitId: parseInt(req.params.id) }}})
    .then(r => {
      res.status(200).json(r)
    }).catch(error => {
      res.status(500).json({ error: error });
    });
});

router.post("/delete", 
passport.isAuthenticated(),
(req, res, next) => {
  const {makeHabit} = req.body.content;
  Habit.updateOne({userId: req.session.passport.user}, 
    {$pull: { habits: { makeHabit: makeHabit }} }
  ).then(doc => {
    if(!doc) res.status(500).json({ error: doc });
    deleteAllEntity({fetchQuery: {makeHabit}, model: Note}, req, res)
  }).catch(error => {
    res.status(500).json({ error: error });
  });
});

router.post("/add", 
passport.isAuthenticated(),
(req, res, next) => {
  // delete, update in one
  // client side will update/remove the habits, we just replace our habit with the one client provides
  // let newHabit = req.body.newHabit;
  // const habitId = randomString();
  // console.log("got nh hid", newHabit, habitId);
  console.log("req.body", req.body);
  const {makeHabit} = req.body.content;

  Habit.updateOne({userId: req.session.passport.user}, {
      $push: {
        habits: { 
          ...req.body.content
        }
      }
  })
    .then(doc => {
      Note.create({userId: req.session.passport.user, makeHabit})
        .then(r => {
          res.status(200).json(doc);
        }).catch(error => {
          res.status(500).json({ error: error });
        });
    }).catch(error => {
      res.status(500).json({ error: error });
    });
});


module.exports = router;
