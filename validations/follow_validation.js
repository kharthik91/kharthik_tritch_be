const Joi = require("joi");


// folloing validatiion

module.exports = {
    followValidator: Joi.object({
        userId: Joi.string() .min(3) .max(30) .required(),
        following: Joi.string(),
        
    }),

};

  