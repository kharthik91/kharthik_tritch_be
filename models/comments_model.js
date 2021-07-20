const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { UserModel } = require('./users_model') 
const {ItinerariesModel} = require ('./itineraries_model')


const CommentsSchema = new mongoose.Schema({
  comments: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: UserModel,},
  itineraries: { type: Schema.Types.ObjectId, ref: ItinerariesModel},
  // itinerary_id: {type: String, required: true},
  // user_id: {type: String, required: true },
});

const CommentsModel = mongoose.model("Comments", CommentsSchema);

module.exports = { CommentsModel };
