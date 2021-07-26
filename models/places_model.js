const mongoose = require('mongoose')


const placesSchema = new mongoose.Schema ({

    destination: { type: String, required: true },
    latlong: { type: String },
    attractions: [{
        name: { type: String },
        photoReference: { type: String },
        photoUrl: { type: String },
        rating: { type: Number},
    }],
  },{timestamps: true})


const PlacesModel = mongoose.model('Places', placesSchema)

module.exports = { PlacesModel}
