const axios = require('axios'); 
const {PlacesModel} = require('../models/places_model')

module.exports = {
 
    checkLocation: async(res, location) => {
        
        try {
            let locationData = await PlacesModel.findOne({destination: location})
 
            return locationData
            
        } catch (err) {
            
            console.log(`Location does not exist in DB`) 
        }
    },


    createLocationData: async(res, location, latlong, attractions) => {
        try {
            await PlacesModel.create({
                destination: location,
                latlong: latlong,
                attractions: attractions
            })
            res.statusCode = 201
            return `Location data created`
        } catch (err) {
            res.statusCode = 500
            return err
        }
    },


// Search for attractions from google places

    placeSearch: async(res, location) => {
        
        try {
            let results = await axios({
                method: 'GET',
                url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.GOOGLEAPI_KEY}&location=${location}&radius=50000&type=tourist_attraction`,
            })
            // console.log(results.data)
            return results.data.results
            
        } catch (err) {
            res.statusCode = 500
            return `Unable to retrieve places`
        }
    },
 
// Retrieve attraction photos from google places
    placePhoto: async(res, photoRef) => {
        
        try {
            let photo = await axios({
                method: 'GET',
                url: `https://maps.googleapis.com/maps/api/place/photo?key=${process.env.GOOGLEAPI_KEY}&photoreference=${photoRef}&maxwidth=600`,
            })
            
            return photo.request._redirectable._options.href
            
        } catch (err) {
            res.statusCode = 500
            return `Unable to retrieve photo`
        }
    }
}