const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { UserModel } = require("../models/users_model");
const { ItinerariesModel } = require("../models/itineraries_model");

const bucketlistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  itineraries: {
    type: Schema.Types.ObjectId,
    ref: ItinerariesModel,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
  },

  been_there: { type: Boolean, default: false, required: true },
});

const BucketlistModel = mongoose.model("Bucketlist", bucketlistSchema);

module.exports = { BucketlistModel };
