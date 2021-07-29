const {ItinerariesModel} = require('../models/itineraries_model')

module.exports = {
 

    getItineraries: async(res, filters, perPage, page) => {
        try {
            let itineraries = await ItinerariesModel.find(filters).skip(perPage * page).limit(perPage).populate("creator")
            return itineraries
        } catch (err) {
            res.statusCode = 500
            return `Unable to retrieve itineraries from database`
        }
    },
    
    countItineraries: async (res, filters) => {
        try {
            let count = await ItinerariesModel.countDocuments(filters)
            return count
        } catch (err) {
            res.statusCode = 500
            return `Unable to count itineraries from database`
        }
    },
    
    getItinerary: async(res, id) => {
        try {
            let itinerary = await ItinerariesModel.findById(id).populate("creator")
            return itinerary
        } catch (err) {
            res.statusCode = 500
            return `Itinerary does not exist`
        }
    },

    createItinerary: async(res, createParams) => {
        try {
            let itinerary = await ItinerariesModel.create(createParams)
            res.statusCode = 201
            return itinerary
        } catch (err) {
            res.statusCode = 500
            return `Unable to write itinerary to database`
        }
    },

    updateItinerary: async(res, id, updateParams) => {
        try {
            await ItinerariesModel.findByIdAndUpdate(id, updateParams)
        } catch (err) {
            res.statusCode = 500
            return `Unable to write itinerary to database`
        }
    },
    

    deleteItinerary: async(res, id) => {
        try {
            await ItinerariesModel.findByIdAndDelete(id)
            res.statusCode = 201
            return `Itinerary updated`
        } catch (err) {
            res.statusCode = 500
            return `Unable to write itinerary to database`
        }
    },
}