const Joi = require("joi");


// comments validatiion

module.exports = {
    commentsValidator: Joi.object({
        comments: Joi.string() .max(200) .required(),
    }),

};

  