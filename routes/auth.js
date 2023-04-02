const express = require("express");
const Joi = require("joi");
const router = express.Router();
const { User } = require("../models/user.js");
const _ = require("lodash");
const bcrypt = require("bcrypt");
require("express-async-errors");

router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User not found");

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(400).send("Invalid password");

    const token = user.generateAuthToken();

    res.send(token);
  } catch (error) {
    let field;
    for (field in error.errors) {
      console.log(error.errors[field]);
    }
  }
});

const validate = (auth) => {
  const schema = Joi.object({
    password: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(auth);
};

module.exports = router;
