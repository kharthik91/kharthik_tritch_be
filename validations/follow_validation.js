const Joi = require("joi");


// folloing validatiion

module.exports = {
    followValidator: Joi.object({
        following: Joi.string() .max(200) .required(),
        
    }),

};

  