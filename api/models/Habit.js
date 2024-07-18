const mongoose = require("mongoose");

const habit_schema = new mongoose.Schema({
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
});
let collectionName = "Habit";
const Habit = mongoose.model(collectionName, habit_schema, collectionName)
module.exports= Habit;