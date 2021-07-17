const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
  
  });

const FollowModel = mongoose.model("follow", FollowSchema);

module.exports = { FollowModel };
