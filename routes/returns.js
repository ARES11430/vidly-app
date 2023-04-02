require("express-async-errors");
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const Rental = require("../models/rental");
const Movie = require("../models/movie");
const { authorize } = require("../middleware/authorize");

router.get("/", async (req, res) => {
  const returns = await Rental.find().sort("customer");
  res.send(returns);
});

router.post("/", authorize, async (req, res) => {
  const { error } = validateReturn(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.lookup(customerID, movieId);

  if (!rental) return res.status(404).send("The given rental was not found.");
  if (rental.dateReturned)
    return res.status(400).send("Rental already returned!");

  rental.return();
  await rental.save();

  await Movie.update(
    { id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  return res.status(200).send(rental);
});

const validateReturn = (req) => {
  const schema = Joi.object({
    customerID: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
};

module.exports = router;
