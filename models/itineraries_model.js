const mongoose = require('mongoose')
const EnumSeasons = ['Spring', 'Summer', 'Fall', 'Winter']

const itinerariesSchema = new mongoose.Schema ({

    location: { type: String, required: true },
    destination: { type: String, required: true },
    latlong: { type: String },
    season: { type: String, required: true, enum: EnumSeasons },
    trip_duration: { type: Number, min: 1, max: 30, required: true },
    itinerary: [{
        day: { type: Date},
        title: { type: String },
        start: { type: Date },
        end: { type: Number},
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