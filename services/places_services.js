const axios = require('axios'); 

module.exports = {
 

    placeSearch: async(res, location) => {
        
        try {
            let results = await axios({
                method: 'GET',
                url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.GOOGLEAPI_KEY}&location=${location}&radius=50000&type=tourist_attraction`,
            })
            console.log(results.data)
            return results.data
            
        } catch (err) {
            res.statusCode = 500
            return `Unable to retrieve places`
        }
    },
    
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