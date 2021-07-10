const mongoose = require("mongoose");


const CommentsSchema = new mongoose.Schema({
  comments: { type: String, required: true, },
});

const CommentsModel = mongoose.model("Comments", CommentsSchema);

module.exports = { CommentsModel };
