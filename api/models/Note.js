const mongoose = require("mongoose");

const note_schema = new mongoose.Schema({
    makeHabit: String,
    userId: String,
    notes:
    {
      type:[{
          noteId: String,
          date: String,
          note: String,
          done: {
              type: Boolean,
              default: false
          },    
      }],
      default: []
    }
});
let collectionName = "Note";
const Note = mongoose.model(collectionName, note_schema, collectionName)
module.exports = Note;