const _ = require('lodash')
const mongoose = require('mongoose')
const {placesValidator} = require('../validations/places_validations')

const {checkLocation, createLocationData, placeSearch, placePhoto} = require ('../services/places_services')
module.exports = {


    search: async (req, res) => {
        let attractions = []
        let photo
        const validationResult = placesValidator.validate(req.params)
        if (validationResult.error) {
            res.statusCode = 400
            return res.json(validationResult.err)
        }
        // Check if location data exist in DB first
        let locationData = await checkLocation(res, req.params.location)
        if (locationData) {
            console.log("hello")
            return res.json(locationData);
            
        } else {
            // Retrieve location data from google places api
            try{
                rawAttractions = await placeSearch(res, req.params.latlong)
            }
            catch(err) {
                console.log(err)
            }
            // Take raw attraction data and extract necessary data and push to attractions array
            try{
                await rawAttractions.map((item) => {
                    attractions.push({
                        name: item.name,
                        photoReference: item.photos[0].photo_reference,
                        rating: item.rating
                    })
                })
            }
            catch(err) {
                console.log(err)
            }
            
            try {
                // Get photo url for each attraction
                await attractions.map(async (item, index) => {
                    try {
                        photo = await placePhoto(res, item.photoReference)
                    }
                   catch(err) {
                       console.log(err)
                   }
                    attractions[index]["photoUrl"] = photo
                    // item["photoUrl"] = photo
                    // console.log(item)
                })
              
                
            }
            catch(err) {
                console.log(err)
            }
            

            // Write data to DB for future access
            
            try {
                 await createLocationData(res, req.params.location,req.params.latlong, attractions)
                
            }
            catch(err) {
                console.log(err)
            }
            return res.json(attractions);

        }
        
  
    },


    // search: async (req, res) => {
    //     let attractions = await placeSearch(res, req.params.location)
    //     return res.json(attractions);
    // },

    photo: async (req, res) => {
        console.log("getting photo")
        let photo = await placePhoto(res, req.params.photoref)
        return res.json(photo);
    },
}