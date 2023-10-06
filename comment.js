const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  message: { type: String },
  user_id: { type: Number },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
