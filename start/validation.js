const Joi = require("joi");

const validation = () => {
  Joi.objectId = require("joi-objectid")(Joi);
};

exports.validation = validation;
