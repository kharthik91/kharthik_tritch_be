const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { UserModel } = require('./users_model') 

const FollowSchema = new mongoose.Schema(
  {
    user: { type: String},
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
