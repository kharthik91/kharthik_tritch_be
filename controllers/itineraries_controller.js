const _ = require('lodash')
const mongoose = require('mongoose')
const {ItinerariesModel} = require('../models/itineraries_model')
const {getItineraries, countItineraries, getItinerary, createItinerary, updateItinerary, deleteItinerary} = require ('../services/itineraries_services')
const {idValidator, listValidator, itinerariesValidator} = require('../validations/itineraries_validations')
const jwt = require('jsonwebtoken')
const moment = require('moment')

module.exports = {

    listAll: async (req, res) => {
        // validate request query params
        const validationResult = listValidator.validate(req.query)
        if (validationResult.error) {
            res.statusCode = 400
            return res.json(validationResult.err)
        }

        const validatedParams = validationResult.value

        let page = 0
        let perPage = 20

        if (validatedParams.page && validatedParams.per_page) {
            let page = validatedParams.page
            let perPage = validatedParams.per_page
        }

        // building up filter to query the database
        let filters = {}
        if (validatedParams.season ) {
            filters.season = validatedParams.season
        }
        if (validatedParams.trip_duration) {
            filters.trip_duration = validatedParams.trip_duration
        }
        if (validatedParams.destination) {
            filters.destination = validatedParams.destination
        }
       
        let totalCount = await countItineraries(res, filters)
        let itineraries = await getItineraries(res, filters, perPage, page)
        console.log(itineraries)
        return res.json({
            itineraries: itineraries,
            totalCount: totalCount
        })
        

    },

    listOwner: async (req, res) => {

        // validate that the userId is valid 
        if (!mongoose.Types.ObjectId.isValid(req.params.userid)) {
            res.statusCode = 400
            return res.json()
        }

        // validate request query params
        const validationResult = listValidator.validate(req.query)
        if (validationResult.error) {
            res.statusCode = 400
            return res.json(validationResult.err)
        }

        const validatedParams = validationResult.value

        let page = 0
        let perPage = 22

        if (validatedParams.page && validatedParams.per_page) {
            let page = validatedParams.page
            let perPage = validatedParams.per_page
        }

        // building up filter to query the database
        let filters = {}
        if (validatedParams.season ) {
            filters.season = validatedParams.season
        }
        if (validatedParams.trip_duration) {
            filters.trip_duration = validatedParams.trip_duration
        }
        if (validatedParams.destination) {
            filters.destination = validatedParams.destination
        }

        filters.creator = req.params.userid


        let totalCount = await countItineraries(res, filters)
        let itineraries = await getItineraries(res, filters, perPage, page)
        
        return res.json({
            itineraries: itineraries,
            totalCount: totalCount
        })
        
    },


    getItinerary: async (req, res) => {
        try{
            // validate that the itineraryID is valid 
            idValidator(res, req.params.id)
    
        }
        catch(err){
            console.log(err)
        }
      
        let itinerary = await getItinerary(res, req.params.id)
        
        return res.json(itinerary)
    },


    createItinerary: async (req, res) => {
        // validation
        // const validationResult = itinerariesValidator.validate(req.body)
        // if (validationResult.error) {
        //     res.statusCode = 400
        //     console.log("error")
        //     return res.json(validationResult.error)
        // }

        const validatedParams = req.body


        let createParams = {
            name: "Trip Name",
            destination: validatedParams.destination,
            season: "Summer",
            trip_duration: 5,
            creator: validatedParams.creator,
            image: validatedParams.image,
            published: false
        }


        // create itinerary
    
        let created = await createItinerary(res, createParams)

        console.log(req.body)
        return res.json(created._id)
   

    },


    updateItinerary: async (req, res) => {
        
        // validate that the itineraryID is valid 
        idValidator(res, req.params.id)

        // input validation
        const validationResult = itinerariesValidator.validate(req.body)
        if (validationResult.error) {
            res.statusCode = 400
            return res.json(validationResult.error)
        }

        const validatedParams = validationResult.value


        let updateParams = {
            name: validatedParams.name,
            destination: validatedParams.destination,
            season: validatedParams.season,
            trip_duration: validatedParams.trip_duration,
            itinerary: validatedParams.itinerary,
            // creator: "60e91dc46bddd93fecb25c6d",
            published: validatedParams.published
        }

   
        // Update itinerary
        let updated = await updateItinerary(res, req.params.id, updateParams)
        return res.json(updated)

    },

    deleteItinerary: async (req, res) => {
        
        // validate that the itineraryID is valid 
        idValidator(res, req.params.id)
        
       // delete
        let deleted = await deleteItinerary(res, req.params.id)
        return res.json(updated)

   },
}