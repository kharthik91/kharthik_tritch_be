const mongoose = require('mongoose')
const {attractionsValidator} = require('../validations/attractions_validations')
const {checkLocation, createLocationData, placeSearch, placePhoto} = require ('../services/attractions_services')
const { checkCity } = require('../services/cities_services')
module.exports = {


    search: async (req, res) => {
        let attractions = []
        let photo
        // const validationResult = attractionsValidator.validate(req.params)
        // if (validationResult.error) {
        //     res.statusCode = 400
        //     return res.json(validationResult.err)
        // }

        // Check if location data exist in DB first
        let locationData = await checkLocation(req.params.location)
        
        if (locationData) {
            return res.json(locationData.attractions);
            
        } else {


            // Retrieve location data from google places api
            try{
                // let cityData = await checkCity(req.params.location)
                
                rawAttractions = await placeSearch(req.params.latlong)
                
            }
            catch(err) {
                console.log(err)
                return 
            }

            // Take raw attraction data and extract necessary data and push to attractions array
           
            rawAttractions.map( (item) => {
                // Retrieve photo
   
                attractions.push({
                    name: item.name,
                    photoReference: item.photos[0].photo_reference,
                    rating: item.rating
                })
            })
            
           
            
            const photoRef = attractions.map(attraction => attraction.photoReference)
            
            const placedPhotos = await Promise.all(photoRef.map(reference => placePhoto(reference)))

            attractions.map((item, index) => {
                item.photoUrl = placedPhotos[index]
            })

            // Write data to DB for future access
            
            try {
                 await createLocationData(res, req.params.location,req.params.latlong, attractions)
                 console.log('written to db')
                
            }
            catch(err) {
                console.log(err)
                return
            }
            console.log(attractions)
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