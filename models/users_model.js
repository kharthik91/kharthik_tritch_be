const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  hash: { type: String, required: true, unique: true },
});

const UserModel = new mongoose.model("User", userSchema);

module.exports = { UserModel };
