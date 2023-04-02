const express = require("express");
const router = express.Router();
const { Genre, validateGenre } = require("../models/genre.js");
const { authorize, admin } = require("../middleware/authorize");
const { validateObjectId } = require("../middleware/validateObjectId.js");

require("express-async-errors");

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
  //throw new Error("error");
});

router.post("/", authorize, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name,
  });
  const result = await genre.save();
  res.send(result);
});

router.put("/:id", [authorize, validateObjectId], async (req, res) => {
  const { error } = validateGenre(req.body);
  let genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
      },
    },
    { new: true }
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  if (error) return res.status(400).send(error.details[0].message);

  res.send(genre);
});

router.delete(
  "/:id",
  [authorize, admin, validateObjectId],
  async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");
    res.send(genre);
  }
);

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

module.exports = router;
