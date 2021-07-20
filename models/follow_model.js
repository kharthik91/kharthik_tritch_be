const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { UserModel } = require('./users_model') 

const FollowSchema = new mongoose.Schema(
  {
    follow: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: UserModel,},
  });

const FollowModel = mongoose.model("follow", FollowSchema);

module.exports = { FollowModel };
