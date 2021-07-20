const mongoose = require('mongoose')
const EnumSeasons = ['Spring', 'Summer', 'Fall', 'Winter']


const itinerariesSchema = new mongoose.Schema ({

    name: { type: String, required: true },
    destination: { type: String, required: true },
    season: { type: String, required: true, enum: EnumSeasons },
    trip_duration: { type: Number, min: 1, max: 30, required: true },
    itinerary: [{
        day: { type: Number},
        event_name: { type: String },
        start_time: { type: Date },
        event_duration: { type: Number},
    }],
    creator: { type: String, required: true},
    editors: [{ type: String }],
    published: { type: Boolean, required: true, default: false }
  },{timestamps: true})


const ItinerariesModel = mongoose.model('Itinerary', itinerariesSchema)

module.exports = {
    ItinerariesModel,
    EnumSeasons
}