const mongoose = require('mongoose')


const itinerarySchema = new mongoose.Schema ({

    name: { type: String, required: true },
    destination: { type: String, required: true },
    season: { type: String, required: true },
    trip_duration: { type: Number, required: true },
    itinerary: [{
        day: { type: Number},
        event_name: { type: String },
        start_time: {}
        event_duration: { type: Number},
    }],
    creator: { type: String, required: true},
    editors: [{ type: String }]
    published: { type: Boolean, required: true, default: false },
    {timestamps: true}
  })


const ItineraryModel = mongoose.model('Itinerary', itinerarySchema)

module.exports = {
    ItineraryModel
}