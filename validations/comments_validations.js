const Joi = require("joi");


// comments validatiion

module.exports = {
    commentsValidator: Joi.object({
        userId: Joi.string() .min(3) .max(30) .required(),
        email: Joi.string() .max(200) .required(),
        followers: Joi.string(),
        followings: Joi.string(),
        
    }),

};

  