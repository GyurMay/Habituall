// const mongoose = require('mongoose');

// // Connect to the database
// // mongoose.connect('mongodb://127.0.0.1:27017/HabitualDB');

// // // Check if the connection is successful
// // const db = mongoose.connection;
// // db.on('error', console.error.bind(console, 'connection error:'));
// // db.once('open', function() {
// //   console.log('Connected to the database');

// //   // Check if the model already exists
// // //   if (mongoose.models && mongoose.models.Habits) {
// // //     console.log('Model already exists');
// // //   } else {
// // //     // Define the Mongoose schema
// // //     const Habits
// // //   }
// // });

// mongoose.connect('mongodb://127.0.0.1:27017/HabitualDB')
//   .then(() => {
//     console.log('Connected to the database');
//     const Habits = require('./api/models/Habits.js')
//     Habits.findOne().then(a => console.log(a));
//   })
//   .catch((error) => {
//     console.log('Connection error:', error);
//   });