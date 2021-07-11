const Joi = require("joi");

module.exports = {
  schemaValidator: Joi.object({
    firstName: Joi.string().required().min(3).max(30),
    lastName: Joi.string().required().min(3).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(30),
    confirmPassword: Joi.string().required().min(6).max(30),
  }),

  loginValidator: Joi.object({
    email: Joi.string().email().required().min(3).max(30),
    password: Joi.string().required().min(6).max(30),
  }),

  updateSchemaValidator: Joi.object({
    firstName: Joi.string().required().min(3).max(30),
    lastName: Joi.string().required().min(3).max(30),
    email: Joi.string().email().required(),
  }),

  changePasswordValidator: Joi.object({
    password: Joi.string().required().min(6).max(30),
    confirmPassword: Joi.string().required().min(6).max(30),
  }),
};
