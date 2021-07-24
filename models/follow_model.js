const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { UserModel } = require('./users_model') 

const FollowSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: UserModel},
    following: {type: Schema.Types.ObjectId, ref: UserModel},
  });

const FollowModel = mongoose.model("follow", FollowSchema);

module.exports = { FollowModel };
