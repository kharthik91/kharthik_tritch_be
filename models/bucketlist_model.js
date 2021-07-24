const mongoose = require("mongoose");

const bucketlistSchema = new mongoose.Schema({
  itinerary_id: { type: String, required: true },
  user_id: { type: String, required: true },
  been_there: { type: Boolean, default: false, required: true },
});

const BucketlistModel = new mongoose.model("Bucketlist", bucketlistSchema);

module.exports = { BucketlistModel };
