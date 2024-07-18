const mongoose = require("mongoose");
// const {MongoClient} = require("mongodb")

// MongoClient.connect('mongodb://127.0.0.1:27017/HabitualDB', (err, db) => {
//     if(err) console.log(err)
//     db.collection('Habits').find({});
// });

mongoose.connect('mongodb://127.0.0.1:27017/HabitualDB')
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.log('Connection error:', error);
  });
  const habitSchema = new mongoose.Schema({
    userId: Number,
    habits: Array
  });
  let collectionName = 'Habits';
  const Habits = mongoose.model(collectionName, habitSchema, collectionName)

  Habits.find({})
  .then(docs => {
    console.log({
      message: 'Documents fetched successfully!',
      habits: docs
    }, docs);
  })
  .catch(error => {
    console.log({ error: error });
  });
 
//   Habits.create({userId: 2,habits: [{ habitId: 100, makeHabit: '100m x 10 dash', breakHabit: 'No high calorie intake', progress: 50, daysRemaining: 5, streak: 0, days: 6}]});
  
//   Habits.find({})
//   .then(docs => {
//     console.log({
//       message: 'Documents fetched successfully!',
//       habits: docs
//     }, docs);
//   })
//   .catch(error => {
//     console.log({ error: error });
//   });