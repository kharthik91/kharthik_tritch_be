const axios = require('axios'); 
const {AttractionsModel} = require('../models/attractions_model')

module.exports = {
 
    checkLocation: async(location) => {
        let locationData = await AttractionsModel.findOne({destination: location})
        if(!locationData) {
            return
            
        }
        return locationData
    },

    createLocationData: async(res, location, latlong, attractions) => {
        try {AttractionsModel.create({
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

    placeSearch: async(location) => {
        console.log("searching places")
        try {
            console.log("searching places api")
            let results = await axios({
                method: 'GET',
                url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.GOOGLEAPI_KEY}&location=${location}&radius=45000`,
            })
            // console.log(results.data)
            return results.data.results
            
        } catch (err) {
            res.statusCode = 500
            return `Unable to retrieve places`
        }
    },
 
// Retrieve attraction photos from google places
    placePhoto: async(photoRef) => {
        
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
    },

    
}