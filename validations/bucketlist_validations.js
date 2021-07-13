const Joi = require("joi");

module.exports = {
  bucketlistValidator: Joi.object({
    itinerary_id: Joi.string().required(),
    user_id: Joi.string().required(),
    been_there: Joi.boolean().required(),
  }),
};
