const _ = require('lodash')
const mongoose = require('mongoose')
const {ItinerariesModel} = require('../models/itineraries_model')
const {listValidator, itinerariesValidator} = require('../validations/itineraries_validations')
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

        // determinining total number of docs in DB that satisfies the filters
        let totalCount = 0
        try {
            totalCount = await ItinerariesModel.countDocuments(filters)
        } catch (err) {
            res.statusCode = 500
            return res.json("nothing to see here")
        }

        // retrieving paginated data based on the filters
        ItinerariesModel.find(filters).skip(perPage * page).limit(perPage)
            .then(response => {
                return res.json({
                    itineraries: response,
                    totalCount: totalCount
                })
            })
            .catch(err => {
                return res.json(err)
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

        // determinining total number of docs in DB that satisfies the filters
        let totalCount = 0
        try {
            totalCount = await ItinerariesModel.countDocuments(filters)
        } catch (err) {
            res.statusCode = 500
            return res.json("nothing to see here")
        }

        // retrieving paginated data based on the filters
        ItinerariesModel.find(filters).skip(perPage * page).limit(perPage)
            .then(response => {
                return res.json({
                    itineraries: response,
                    totalCount: totalCount
                })
            })
            .catch(err => {
                return res.json(err)
            })
    },


    create: (req, res) => {
        console.log(req.body)
        // validation
        const validationResult = itinerariesValidator.validate(req.body)
        if (validationResult.error) {
            res.statusCode = 400
            return res.json(validationResult.error)
        }

        const validatedParams = validationResult.value

        //  // check if auth_token header is given, if not, return 401 unauthorised
        // if (!req.headers.auth_token) {
        //     res.statusCode = 401
        //     return res.json()
        // }

        //  // verify JWT token
        //  let decodedJWT = null
        //  try {
        //      decodedJWT = jwt.verify(req.headers.auth_token, process.env.JWT_SECRET)
        //  } catch (err) {
        //      res.statusCode = 403
        //      return res.json()
        //  }
        //  if (decodedJWT === null) {
        //     res.statusCode = 403
        //     return res.json()
        //  }


        // return res.json()

        let createParams = {
            name: validatedParams.name,
            destination: validatedParams.destination,
            season: validatedParams.season,
            trip_duration: validatedParams.trip_duration,
            itinerary: validatedParams.itinerary,
            creator: "60e91dc46bddd93fecb25c6d",
            published: false
        }

        // // check if there is a file upload
        // if (req.file) {
        //     createParams.image = req.file.path
        // }

        // create 
        ItinerariesModel.create(createParams)
            .then(response => {
                res.statusCode = 201
                return res.json("item created")
            })
            .catch(err => {
                res.statusCode = 500
                return res.json(err)
            })

    },

    listAnimals: async (req, res) => {
        // validate request query params
        const validationResult = listAnimalValidator.validate(req.query)
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
        if (validatedParams.isAdopted !== null && validatedParams.isAdopted !== "" && validatedParams.isAdopted !== undefined) {
            filters.adopted = validatedParams.isAdopted
        }
        if (validatedParams.gender) {
            filters.gender = validatedParams.gender
        }

        // determinining total number of docs in DB that satisfies the filters
        let totalCount = 0
        try {
            totalCount = await AnimalModel.countDocuments(filters)
        } catch (err) {
            res.statusCode = 500
            return res.json()
        }

        // retrieving paginated data based on the filters
        AnimalModel.find(filters).skip(perPage * page).limit(perPage)
            .then(response => {
                return res.json({
                    animals: response,
                    totalCount: totalCount
                })
            })
            .catch(err => {
                return res.json(err)
            })
    },

    getAnimal: (req, res) => {

        // validate that the animalID is a valid MongoDB ObjectID
        if (!mongoose.Types.ObjectId.isValid(req.params.animalID)) {
            res.statusCode = 400
            return res.json()
        }

        AnimalModel.findOne({ _id: req.params.animalID })
            .then(response => {
                if (!response) {
                    res.statusCode = 404
                    return res.json()
                }

                return res.json(response)
            })
            .catch(err => {
                console.log(err)
                res.statusCode = 500
                return res.json(err)
            })

    },

    updateAnimal: async (req, res) => {
        const validationResult = animalValidator.validate(req.body)
        if (validationResult.error) {
            res.statusCode = 400
            return res.json(validationResult.error)
        }

        const validatedParams = validationResult.value

        let animal = null

        // check if animal exists
        try {
            animal = await AnimalModel.findOne({_id: req.params.animalID})
        } catch (err) {
            res.statusCode = 500
            return res.json(err)
        }
        if (!animal) {
            res.statusCode = 404
            return res.json()
        }

        // update
        try {
            await animal.updateOne(validatedParams)
        } catch (err) {
            res.statusCode = 500
            return res.json()
        }

        return res.json()
    },

    delete: async (req, res) => {
        let animal = null

        // check if animal exists
        try {
            animal = await AnimalModel.findOne({_id: req.params.animalID})
        } catch (err) {
            res.statusCode = 500
            return res.json(err)
        }
        if (!animal) {
            res.statusCode = 404
            return res.json()
        }

        try {
            await AnimalModel.deleteOne({_id: req.params.animalID})
        } catch (err) {
            console.log(err)
            res.statusCode = 500
            return res.json(err)
        }

        return res.json()
    }

}