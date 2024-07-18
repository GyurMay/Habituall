const express = require("express");

const Users = require("../../models/User");
const Habit = require("../../models/Habit");
const Note = require("../../models/Note");
// const passport = require("t");
const passport = require('../authentication');

const router = express.Router();

router.use(passport.isAuthenticated());

router.post("/search", 
  (req, res) => {
    // console.log("errthing working fine", req);
    const {username} = req.body.content;
    Users.find({$or: [{name: {$regex: username}}, {username: {$regex: username}}]},
       {_id:0, username:1})
      .then(doc => {
        res.status(200).json(doc);
      }).catch(e => res.status(500).json({error: e}));
  });

router.get("/:username/habits/:makeHabit",
  (req, res) => {
    const {username, makeHabit} = req.params;
    try{
      Users.find({username}, {_id:0, userId: 1})
        .then(doc => {
          const userId = doc[0].userId;
          if(!doc) res.status(500).json({error:doc}); 
          console.log("doc userid", userId, doc);
            (async () => {
              const doc = await Note.aggregate([
                {$match: {userId, makeHabit}},
                {$lookup: {from: "Habit", localField: "userId", foreignField: "userId", as: "HabitInfo"}},
                {$unwind: "$HabitInfo"},
                {$unwind: "$HabitInfo.habits"},
                {$match: {"HabitInfo.habits.makeHabit": makeHabit}},
                {$project: {makeHabit: "$makeHabit" , notes: "$notes",createDate: "$HabitInfo.habits.createDate", dueDate: "$HabitInfo.habits.dueDate"}}
              ]).exec();

              if(!doc) res.status(500).json({error:doc}) 
              res.status(200).json(doc);
            })();
        })
    }catch(e){
      res.status(500).json({error:e})
    };
    
  });

  router.post("/profile",
  (req, res) => {
    const {username} = req.body;
    Users.findOne({username}, {password:0, _id:0,})
    .then(doc => {
      console.log("doc pro", doc)
      if(!doc) {
        res.status(500).json({err: doc});
        return;
      }

      //username is a friend
      sendUserHabits(doc);
    }).catch(err => res.status(500).json({ error: err }));

    const sendUserHabits = (doc) => {
      Habit.find({userId: doc.userId}, {userId: 0, _id: 0})
        .then(habits => {
          //filter the userId
          doc.userId = undefined;

          res.status(200).json({userInfo:doc, habits})
        }).catch(error => {
          res.status(500).json({ error: error });
        });
      };

  });

  router.post("/:username/follow", (req, res) => {
    const {username} = req.params;
    try{
    Users.updateOne({userId: req.session.passport.user}, {
      $push: {
        following: username
      }
    }).then(d => {
        Users.findOne({userId: req.session.passport.user},{
          username: 1, _id:0
        }).then(me => {
          Users.updateOne({username}, 
          {$push: {followers: me.username}})
          .then(dd => {
            res.status(200).json(dd);
          })
        })
    });
  }catch(e){ res.status(500).json({error: e}); };
  });

  router.post("/:username/unfollow", (req, res) => {
    const {username} = req.params;
    try{
    Users.updateOne({userId: req.session.passport.user}, {
      $pull: {
        following: username
      }
    }).then(d => {
        Users.findOne({userId: req.session.passport.user},{
          username: 1, _id:0
        }).then(me => {
          Users.updateOne({username}, 
          {$pull: {followers: me.username}})
            .then(dd => {
              res.status(200).json(dd);
            });
          })
    });
  }catch(e){ res.status(500).json({error: e}); };
    
  });

  router.get("/selfProfile", (req, res) => {
    try{
      (async()=>{
        const notes = await Note.find(
          { userId: req.session.passport.user, "notes.done": true },
          { "notes": 1, makeHabit: 1 }
        ).lean();
        const habitInfo = await Habit.find({userId: req.session.passport.user}, {habits: 1}).lean();
        console.log("notesss", notes)
        habitInfo[0].habits.forEach(habitArrEl => {
          habitArrEl.daysDone = notes?.find(note => note.makeHabit === habitArrEl.makeHabit)?.notes?.length;
          // console.log("inserting notes", habitArrEl.notes?, habitArrEl);
        })
        console.log(habitInfo[0], "habitinfo")
        res.status(200).json(habitInfo[0].habits);
      })();
    }catch(e){res.status(500).json({error: e})}
  })
  
  router.get("/feed", (req, res) => {
    try{
      // Users.findOne({userId:req.session.passport.user}, {following: 1, _id:0})
      //   .then(following => {
      //       console.log("following", following);
      //       res.status(200).json(following);  
      //     }
      //   );
      (async()=>{
        const resp = await Users.findOne({userId: req.session.passport.user}, {following:1, _id:0});
        const followingUsername = resp.following;
        console.log("follwing username", followingUsername)
        let following = await Users.aggregate([
          {$match: {username: {$in: followingUsername}}},
          {$project: {userId:1, _id:0 }}
        ]);

        following = following.map(x => x.userId)//.filter(y => y !== req.session.passport.user);
        let habitLim = 2;
        console.log("got the following array", following)
        const allHabits = await Habit.aggregate([
          {$match: {userId: {$in: following}}},
          {$project: {userId: 1, habits: {$slice: ["$habits", 10]}}},
          {$unwind: "$habits"},
          {$lookup: {from: "Users", localField: "userId", foreignField: "userId", as: "userDetails"}},
          {$unwind: "$userDetails"},
          {$group: {_id: null, combinedHabits: {$push: {habit: "$habits", userId: null, username: "$userDetails.username"}}}},
          {$project: {_id: 0, combinedHabits: 1}}
        ]);

   


        console.log(allHabits, "tags")

        res.status(200).json({allHabits});
      })();
      }
      catch(e){
         res.status(500).json({error: e}); 
      };
  });

module.exports = router;
