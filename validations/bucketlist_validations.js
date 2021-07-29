const Joi = require("joi");

module.exports = {
  bucketlistValidator: Joi.object({
    userID: Joi.string().required(),
    itinerariesID: Joi.string().required(),
  }),

  deleteBucketlistValidator: Joi.object({
    userID: Joi.string().required(),
    itinerariesID: Joi.string().required(),
  }),
};
