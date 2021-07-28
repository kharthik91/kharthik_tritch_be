const Joi = require('joi')

module.exports = {

    citiesValidator: Joi.object({
        latlong: Joi.string()
            .min(3)
            .max(50),
        location: Joi.string()
            .min(3)
            .max(50)
            .required(),
        attractions: Joi.array().items({
            name: Joi.string(),
            photoUrl: Joi.string(),
            photoReference: Joi.string(),
            rating: Joi.number()
        }),
    }),


}