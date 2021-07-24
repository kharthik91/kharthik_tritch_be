const mongoose = require("mongoose");


const CommentsSchema = new mongoose.Schema({
  comments: { type: String, required: true },
  itinerary_id: {type: String, required: true},
  user_id: {type: String, required: true },
});

const CommentsModel = mongoose.model("Comments", CommentsSchema);

module.exports = { CommentsModel };