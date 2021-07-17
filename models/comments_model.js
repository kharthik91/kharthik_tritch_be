const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentsSchema = new mongoose.Schema({
  comments: { type: String, required: true },
  // users: {
  //         type: Schema.Types.ObjectId, 
  //         ref: 'User'},
  itinerary_id: {type: String, required: true},
  user_id: {type: String, required: true },
});

const CommentsModel = mongoose.model("Comments", CommentsSchema);

module.exports = { CommentsModel };
