const Joi = require("@hapi/joi");

exports.signup = () => {
  return Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
};
