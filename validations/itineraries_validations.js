const Joi = require('joi')
const {EnumSeasons} = require('../models/itineraries_model')
const mongoose = require('mongoose')

module.exports = {
    idValidator: (res, id) => {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.statusCode = 400
            return res.json("Itinerary ID is invalid")
        }
    },
    listValidator: Joi.object({
        destination: Joi.string().allow("", null),
        season: Joi.string().allow("", null),
        trip_duration: Joi.number().allow("", null),
        page: Joi.number().min(0).allow("", null),
        per_page: Joi.number().min(0).allow("", null),
    }),
    itinerariesValidator: Joi.object({
        name: Joi.string()
            .min(3)
            .max(50)
            .required(),
        destination: Joi.string()
            .min(3)
            .max(50)
            .required(),
        season: Joi.string()
            .valid(...EnumSeasons),
        trip_duration: Joi.number()
            .min(1)
            .max(30),
        itinerary: Joi.array().items({
            title: Joi.string(),
            start: Joi.date(),
            end: Joi.date()
        }),
        creator: Joi.string(),
        editors: Joi.array().items(Joi.string()),
        published: Joi.boolean()
    }),


}