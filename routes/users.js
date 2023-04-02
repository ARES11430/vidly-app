const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user.js");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { authorize } = require("../middleware/authorize");
require("express-async-errors");

router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User is already registered!");
  try {
    user = new User(_.pick(req.body, ["name", "password", "email"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    res.header("x-auth", token).send(_.pick(user, ["_id", "name", "email"]));
  } catch (error) {
    let field;
    for (field in error.errors) {
      console.log(error.errors[field]);
    }
  }
});

router.put("/:id", authorize, async (req, res) => {
  const { error } = validate(req.body);
  let user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
      },
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  if (error) return res.status(400).send(error.details[0].message);

  res.send(user);
});

router.delete("/:id", authorize, async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  res.send(user);
});

router.get("/:me", authorize, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  res.send(user);
});

module.exports = router;
