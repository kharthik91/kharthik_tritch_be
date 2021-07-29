const Joi = require("joi");

module.exports = {
  bucketlistValidator: Joi.object({
    userID: Joi.string().required(),
    itinerariesID: Joi.string().required(),
    been_there: Joi.boolean().required(),
  }),

  deleteBucketlistValidator: Joi.object({
    userID: Joi.string().required(),
    itinerariesID: Joi.string().required(),
  }),
};
