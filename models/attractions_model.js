const mongoose = require('mongoose')


const attractionsSchema = new mongoose.Schema ({
    slug: { type: String},
    destination: { type: String, required: true },
    latlong: { type: String },
    attractions: [{
        name: { type: String },
        photoReference: { type: String },
        photoUrl: { type: String },
        rating: { type: Number},
        location:{
          lat:{ type: Number},
          lng:{ type: Number}
        }
    }],
  },{timestamps: true})


const AttractionsModel = mongoose.model('Attractions', attractionsSchema)

module.exports = { AttractionsModel}
