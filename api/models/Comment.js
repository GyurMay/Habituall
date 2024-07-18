const mongoose = require("mongoose");

const comment_schema = new mongoose.Schema({
  noteId: String,
  comments: {
  type: [
    {
      commentId: String,
      userId: String,
      comment: String,
      name: String,
      date: String
    }
  ],
  default: []
  }
});
let collectionName = "Comment";
const Comment = mongoose.model(collectionName, comment_schema, collectionName);
module.exports = Comment;