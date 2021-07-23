const Joi = require('joi')
const {EnumSeasons} = require('../models/itineraries_model')

module.exports = {
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
            .valid(...EnumSeasons)
            .required(),
        trip_duration: Joi.number()
            .min(1)
            .max(30)
            .required(),
        itinerary: Joi.array().items({
            day: Joi.number()
                .min(0),
            event_name: Joi.string(),
            start_time: Joi.string()
                .regex( /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
            event_duration: Joi.number()
                .min(1)
                .max(1440)
            
        }),
        creator: Joi.string()
            .required(),
        editors: Joi.array().items(Joi.string()),
        published: Joi.boolean()
            .required()
    }),


}