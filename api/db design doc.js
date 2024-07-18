
// structure the insise of an array key in mongodb

Note schema:
{
    userId,
    makeHabit,
  notes: [
    {
      noteId: String,
      date: String,
      note: String,
      done: boolean | undefined    
    }
  ]
}

Comment Schema 
{
  noteId: String,
  comments: {
  type: [
    {
      commentId: String,
      userId: String,
      comment: String,
      name: String
    }
  ],
  default: []
  }
}


Habit schema:
{
  userId: String,
  habits: {
      type: [{
              createDate: String,
              makeHabit: String,
              breakHabit: String,
              dueDate: String 
          }],
      default: []
  }
}

Notes
load = Note.findOne({userId, makeHabit}).notes; //done
add = Note.update({userId, makeHabit}, {$push: {
  noteId: generate(),
  note, date, done
}})  // ^- here api/note/create
update(only todays note) = Note.updateOne({userId: "k4x9g3yhk6", makeHabit: "hello", notes: {$elemMatch: {date:"Mon Jul 01 2024"}}}, {$set: {"notes.$.note": "hello note 1 changed"}};
delete = Note.updateOne({userId, makeHabit}, {$pull: {notes:{noteId}}})

Comments
load = Comment.findOne({noteId: noteid}).comments;
add = Comment.update({noteId: noteid}, {$push: {
  commentId: genereate(),
  userId, comment, date
}});
delete = Comment.updateOne({comments: {$elemMatch: {commentId: commentid}}},{$set: {"comments.$": {}}});

Habit
load = Habit.find({userId}) //dopne
add = Habit.updateOne({userId: userid}, {$push: {
    // habitId: increment(),
    makeHabit, breakHabit, dueDate
}}) //done
delete = Habit.updateOne({userId, makeHabit}, {$pull: {makeHabit: makeHabit}})


Users (admin)
load = Users.find({userId})

add (register) = checkExist && 
Users.create({username, password, motto, name, friends})
&& Habit.create({userId})

delete //not yet
update = Users.updateOne({userId}, {$set: {userInfo}}) //userInfo with motto, name, etc.. change


// Feed schema:
// {
//   userId: String,
//   catchups: [
//     {
//       username: String,

//     }
//   ]
// }

/profile
Note notes.noteCount makeHabit
Habit dueDate 
