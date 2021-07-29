const mongoose = require('mongoose')
const EnumSeasons = ['Spring', 'Summer', 'Fall', 'Winter']
const { UserModel } = require('./users_model') 
const Schema = mongoose.Schema;

const itinerariesSchema = new mongoose.Schema ({

    name: { type: String},
    destination: { type: String, required: true },
    latlong: { type: String },
    season: { type: String, enum: EnumSeasons },
    trip_duration: { type: Number, min: 1, max: 30},
    itinerary: [{
        day: { type: Date},
        title: { type: String },
        start: { type: Date },
        end: { type: Number},
        extendedProps:{
            image:{ type: String },
        },
    }],
    creator: { type: Schema.Types.ObjectId, ref: UserModel},
    editors: [{ type: Schema.Types.ObjectId, ref: UserModel}],
    published: { type: Boolean, default: false }
  },{timestamps: true})


const ItinerariesModel = mongoose.model('Itinerary', itinerariesSchema)

module.exports = {
    ItinerariesModel,
    EnumSeasons
}