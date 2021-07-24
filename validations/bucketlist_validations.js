const Joi = require("joi");

module.exports = {
  bucketlistValidator: Joi.object({
    email: Joi.string().email().required(),
    been_there: Joi.boolean().required(),
  }),
};
