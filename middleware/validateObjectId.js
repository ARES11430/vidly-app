const mongoose = require("mongoose");

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("The genre with the given ID was not found.");

  next();
};

module.exports = {
  validateObjectId,
};
