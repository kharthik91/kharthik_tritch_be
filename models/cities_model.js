const mongoose = require('mongoose')


const citiesSchema = new mongoose.Schema ({
    slug: { type: String, required: true },
    destination: { type: String, required: true },
    latlong: { type: String },
    attractions: [{
        name: { type: String },
        photoReference: { type: String },
        photoUrl: { type: String },
        rating: { type: Number},
    }],
  },{timestamps: true})


const CitiesModel = mongoose.model('Cities', citiesSchema)

module.exports = { CitiesModel}
