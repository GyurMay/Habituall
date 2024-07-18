const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
    userId: String,
    habits: Array
});
let collectionName = 'Habits';
const Habits = mongoose.model(collectionName, habitSchema, collectionName)

module.exports = Habits;