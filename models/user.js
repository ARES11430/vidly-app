const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 5,
    maxlenght: 50,
  },
  password: {
    type: String,
    required: true,
    minlenght: 5,
    maxlenght: 1024,
  },
  email: {
    type: String,
    required: true,
    minlenght: 5,
    maxlenght: 255,
    unique: true,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.PRIVATE_KEY
  );
};
const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(user);
};

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;
