const mongoose = require('mongoose')


const citiesSchema = new mongoose.Schema ({
    slug: { type: String, required: true },
    destinationType: { type: String },
    name: { type: String, required: true },
    longName: { type: String},
    population: { type: Number},
    latlong: { type: String },
    lat: { type: String },
    long: { type: String },
    budget: {
      value: { type: Number },
      text: { type: String },
    },
    safety: {
      value: { type: Number },
      text: { type: String },
    },
    rating: {type: Number},
    knownFor: [{
      name:{type:String},
      icon:{type:String},
    }],
    image: { type: String },
   
  },{timestamps: true})


const CitiesModel = mongoose.model('Cities', citiesSchema)

module.exports = { CitiesModel}
