const Joi = require("joi");


// comments validatiion

module.exports = {
    followValidator: Joi.object({
        comments: Joi.string() .max(200) .required(),
    }),

};

  