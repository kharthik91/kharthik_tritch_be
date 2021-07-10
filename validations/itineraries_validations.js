const Joi = require('joi')
const {EnumSeasons} = require('../models/itineraries_model')

module.exports = {



    listAllValidator: Joi.object({
        destination: Joi.string().allow("", null),
        season: Joi.string().allow("", null),
        trip_duration: Joi.number().allow("", null),
        page: Joi.number().min(0).allow("", null),
        per_page: Joi.number().min(0).allow("", null),
    })

}