const Joi = require("@hapi/joi");

exports.createPost = () => {
  return Joi.object({
    // type: Joi.string().required(),
    caption: Joi.string().optional(),
  });
};
